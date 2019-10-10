/* eslint-disable react/display-name */
import React, {
  createContext,
  memo,
  useReducer,
  createElement,
  useContext,
  useEffect,
  useMemo,
  Dispatch,
  forwardRef,
  useRef,
  useImperativeHandle
} from "react";
import { IConfigRenderer, IConfig, IConfigNode, IValidationConfig, DisabledConfig, ICustomHandlerConfig } from "./types";
import { handleEvent } from "./eventHandling";
import { validator } from "./validator";

// import produce from "immer";
import { booleanProcessor } from "./booleanProcessor";
import { capitalize } from "./shared";

const getWrapperComponentName = (componentId: string) => `${capitalize(componentId)}MasonWrapper`;

export type ActionType = {
  type: string;
  payload: any;
};

/*
const immerReducer = (state, { type, payload }) => {
  return produce(state, draft => {
    switch (type) {
      case "ADD_ENTRY":
        draft[payload.id] = payload.props;
        break;
      case "UPDATE_ENTRY":
        draft[payload.id] = { ...state[payload.id], ...payload.props };
        break;
      case "UPDATE_PROP":
        {
          if (!state[payload.id]) {
            throw new Error(`Invalid component id ${payload.id} provided for prop updation`);
          }
          draft[payload.id][payload.prop] = payload.value;
        }
        break;
      case "REPLACE_STATE_VALUES":
        for (const [key, val] of Object.entries(payload)) {
          draft[key]["value"] = (val as any).value;
        }
        break;
    }
  });
};
*/

const reducer = (state, { type, payload }) => {
  switch (type) {
    case "ADD_ENTRY":
      return {
        ...state,
        [payload.id]: payload.props
      };
    case "UPDATE_ENTRY":
      return {
        ...state,
        [payload.id]: { ...state[payload.id], ...payload.props }
      };
    case "UPDATE_PROP": {
      if (!state[payload.id]) {
        throw new Error(`Invalid component id ${payload.id} provided for prop updation`);
      }
      return {
        ...state,
        [payload.id]: {
          ...state[payload.id],
          [payload.prop]: payload.value
        }
      };
    }

    case "REPLACE_STATE_VALUES": {
      const draft = { ...state };
      for (const [key, val] of Object.entries(payload)) {
        draft[key]["value"] = (val as any).value;
      }
      return draft;
    }

    default:
      return state;
  }
};

export type IRendererOptions = {
  initialValues?: Map<string, any>;
  dataProcessors?: {
    [k: string]: (a: any) => any;
  };
  resolvers?: {
    [k: string]: (a: any) => any;
  };
  onStateChange?: (state: { [k: string]: any }) => void;
  onErrorStateChange?: (hasErrors: boolean) => void;
};

type IRendererContext = {
  state: IObject;
  dispatch: Dispatch<{
    type: string;
    payload: any;
  }>;
};

const context = createContext<IRendererContext>(null as any);

const wrappedDispatch = (
  dispatch: React.Dispatch<ActionType>,
  validations: Array<IValidationConfig> = [],
  options?: { onStateChange?: IRendererOptions["onStateChange"] }
) => ({ type, payload }) => {
  const isValuedBeingUpdated = type === "UPDATE_PROP" && payload.prop === "value";
  if (isValuedBeingUpdated) {
    const { value, id: fieldId } = payload;
    const validationErrors = validator(validations, value);
    const hasErrors = Object.values(validationErrors).some(Boolean);
    dispatch({
      type: "UPDATE_PROP",
      payload: {
        id: fieldId,
        prop: "validations",
        value: { hasErrors, errors: validationErrors }
      }
    });
  }
  const state = dispatch({ type, payload });
  if (options && options.onStateChange && isValuedBeingUpdated) {
    options.onStateChange(reducer(state, { type, payload }));
  }
};

function constructStateFromValue(config: IConfigNode | Array<IConfigNode>, state, values: Map<string, any>) {
  if (Array.isArray(config)) {
    config.forEach(childConfigNode => constructStateFromValue(childConfigNode, state, values));
    return state;
  }
  const { meta, id, children } = config;
  if (values && values.get(id)) {
    state[id] = { ...(state[id] || {}), value: values.get(id), initialValue: values.get(id) };
  } else if (meta && typeof meta.value !== "undefined") {
    state[id] = { ...(state[id] || {}), value: meta.value, initialValue: meta.value };
  }
  // if (validations && state[id]) {
  //   const validationErrors = validator(validations, state[id].value);
  //   const hasErrors = Object.values(validationErrors).some(Boolean);
  //   state[id]["isValid"] = hasErrors;
  // }
  if (children) {
    children.forEach(childConfigNode => constructStateFromValue(childConfigNode, state, values));
  }
  return state;
}

function determineValidationStatus(config: IConfigNode | IConfigNode[], state: IObject, isValid: boolean) {
  if (Array.isArray(config)) {
    return config.reduce(
      (acc: boolean, configNode: IConfigNode) => acc && determineValidationStatus(configNode, state, isValid),
      isValid
    );
  }
  if (config.validations) {
    const validationErrors = validator(config.validations, state[config.id].value);
    const hasErrors = Object.values(validationErrors).some(Boolean);
    if (hasErrors) return false;
  }
  if (config.children) {
    return determineValidationStatus(config.children, state, isValid);
  }
  return true;
}

const RootComponentCore: React.ForwardRefExoticComponent<{
  initialState: any;
  instance: ReactConfigRenderer;
}> = forwardRef(({ children, initialState = {}, instance }, ref) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useImperativeHandle(
    ref,
    () => ({
      setRootState(config: IConfigNode, val) {
        const newState = constructStateFromValue(config, { ...state }, val);
        dispatch({ type: "REPLACE_STATE_VALUES", payload: newState });
      }
    }),
    [state]
  );

  /* Check if any of the current state value hasErrors. And set the root Renderer instance value accordingly */
  const hasErrors = Object.values(state).some(({ validations }) => validations && validations.hasErrors);
  if (instance.hasErrors !== hasErrors) {
    const { onErrorStateChange } = instance.options;
    onErrorStateChange && onErrorStateChange(hasErrors);
    instance.hasErrors = hasErrors;
  }

  /* Check if any of the current state value have been changed and set the pristine flag on the Renderer instance */
  instance.isPristine = instance.checkIfValuesPristine(state);

  /** A silent flag to check the validation status of the whole form in general by executing validators of
   * each config node against its corresponding value in the state. */
  instance.isInvalid = !determineValidationStatus(instance.config.config, state, true);

  const props = {
    value: {
      state,
      dispatch: (action: ActionType) => {
        dispatch(action);
        return state;
      }
    }
  };
  return createElement(context.Provider, props, children);
});

export const RootComponent: React.NamedExoticComponent<any> = memo(RootComponentCore);

type IObject = {
  [k: string]: any;
};

// const eventsSeedValue = {};

const evaluateDisabledClause = (
  disabled: boolean | DisabledConfig | ICustomHandlerConfig,
  { rootState, resolvers, instance }
) => {
  if (typeof disabled !== "undefined") {
    if (typeof disabled === "boolean") return disabled;
    if (disabled.type) {
      if (disabled.type === "CUSTOM") {
        const { meta } = disabled as ICustomHandlerConfig;
        if (resolvers && resolvers[meta.name]) {
          return resolvers[meta.name](instance);
        }
      }
      return booleanProcessor(disabled as DisabledConfig, rootState);
    }
  }
};

export class ReactConfigRenderer implements IConfigRenderer<React.ReactNode> {
  private components: Map<string, React.Component> = new Map();
  readonly config: IConfig;
  private elementsMap: Map<string, React.ComponentType<any>>;
  public options: IRendererOptions;
  private currentRootStateSnapshot: IObject;
  private rootComponentRef: React.MutableRefObject<any> | null;
  public hasErrors = false;
  public isPristine = true;
  public isInvalid = false;
  constructor(config: IConfig, elementsMap: Map<string, React.ComponentType<any>>, options?: IRendererOptions) {
    this.config = config;
    this.elementsMap = elementsMap;
    this.options = options || {};
    this.renderConfigNode = this.renderConfigNode.bind(this);
    this.currentRootStateSnapshot = {};
    this.rootComponentRef = null;
  }
  renderConfigNode(node: IConfigNode) {
    const { id, type, meta = {}, data, events = {}, validations, children, style, show, disabled } = node;
    const { dataProcessors = {}, onStateChange, resolvers } = this.options;

    const elementComponent = this.elementsMap.get(type);
    if (!elementComponent) {
      throw new Error(`No component exists for type ${type}`);
    }
    const wrappedComponent: React.MemoExoticComponent<any> & { whyDidYouRender?: boolean } = memo(props => {
      /** Getting the reducer context as a consumer for reading the state and dispatching actions */
      const { state: rootState, dispatch } = useContext(context);

      const rootDispatch = wrappedDispatch(dispatch, validations, { onStateChange });
      this.currentRootStateSnapshot = rootState;

      /** Creating the event handlers out of the events config */
      const eventsMap = useMemo(() => {
        return Object.entries(events).reduce((eventsObj, [eventName, eventConfig]) => {
          const eventHandler = (event: Event, value?: any) => {
            /** Executing multiple event handlers in case an array is provided against an event type in config */
            if (Array.isArray(eventConfig)) {
              eventConfig.forEach(config => {
                handleEvent(config, { id, event, dataProcessors, value, resolvers }, rootDispatch, rootState);
              });
            } else {
              handleEvent(eventConfig, { id, event, dataProcessors, value, resolvers }, rootDispatch, rootState);
            }
          };
          eventsObj[eventName] = eventHandler;
          return eventsObj;
        }, {});
      }, [events, rootState, rootDispatch]);

      /** Storing the component and its props in the rootState on mounting */
      useEffect(() => {
        rootDispatch({
          type: rootState[id] ? "UPDATE_ENTRY" : "ADD_ENTRY",
          payload: {
            id,
            props: { ...meta, ...props, value: rootState[id] ? rootState[id].value : meta.value }
          }
        });
        /** Checking if data key is provided in the config and setting the datasource on component Mount */
        if (data) {
          handleEvent(data, { id, dataProcessors, resolvers }, rootDispatch, rootState);
        }
      }, []);

      const disabledEvaluated = evaluateDisabledClause(disabled, { rootState, resolvers, instance: this });

      /** Constructing the original component by setting its props from the rootState and returning it */
      const component = React.useMemo(
        () =>
          createElement(
            elementComponent,
            { ...(rootState[id] ? rootState[id] : { ...meta, ...props }), disabled: disabledEvaluated, ...eventsMap },
            props.children
          ),
        [rootState[id], eventsMap, props.children]
      );
      const showCondition: boolean = show !== undefined ? booleanProcessor(show, rootState) : true;
      useEffect(() => {
        /**
         * Check if the element has been hidden based on the show condition above and
         * hence reset it's value into the rootState.
         */
        if (!showCondition && rootState[id] && typeof rootState[id].value !== "undefined") {
          rootDispatch({
            type: "UPDATE_PROP",
            payload: {
              id,
              prop: "value",
              value: meta.value
            }
          });
        }
      }, [showCondition]);

      return showCondition ? createElement("section", props, component) : null;
    });
    wrappedComponent.displayName = getWrapperComponentName(id);
    // wrappedComponent.whyDidYouRender = true;
    const el = createElement(
      wrappedComponent,
      { key: id, style, id },
      ...(children ? children.map(this.renderConfigNode) : [])
    );
    // this.components.set(id, el);
    return el;
  }

  checkIfValuesPristine(rootState: IObject) {
    return Object.values(rootState).reduce((acc, { value, initialValue }) => {
      if (typeof initialValue === "undefined") return acc && !value;
      return acc && JSON.stringify(initialValue) === JSON.stringify(value);
    }, true);
  }

  constructInitialState(config: IConfigNode | Array<IConfigNode>, initialState) {
    const { initialValues } = this.options;
    return constructStateFromValue(config, initialState, initialValues);
  }

  getValuesFromState(state: IObject) {
    return Object.entries(state).reduce((acc, [key, val]) => {
      if (typeof val.value !== "undefined") {
        acc[key] = val.value;
      }
      return acc;
    }, {});
  }

  getCurrentValuesSnapshot() {
    return this.getValuesFromState(this.currentRootStateSnapshot);
  }

  public setValue(val) {
    if (this.rootComponentRef) {
      this.rootComponentRef.current.setRootState(this.config.config, val);
    }
  }

  render() {
    return memo(() => {
      const { config } = this.config;
      const initialState = this.constructInitialState(config, {});
      this.rootComponentRef = useRef();
      return createElement(
        RootComponent,
        { initialState, ref: this.rootComponentRef, instance: this },
        Array.isArray(config) ? config.map(this.renderConfigNode) : [this.renderConfigNode(config)]
      );
    });
  }
}
