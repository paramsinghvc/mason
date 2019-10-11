/* eslint-disable react/display-name */
import * as React from "react";
import {
  IConfigRenderer,
  IConfig,
  IConfigNode,
  IValidationConfig,
  DisabledConfig,
  ICustomHandlerConfig,
  State,
  Dispatch,
  ActionType,
  IObject,
  IRendererOptions,
  FunctionsMap,
  ValidatorFunctionsMap
} from "./types";
import { handleEvent } from "./eventHandling";
import { validator } from "./validator";

// import produce from "immer";
import { booleanProcessor } from "./booleanProcessor";
import { capitalize } from "./shared";

const {
  createContext,
  memo,
  useReducer,
  createElement,
  useContext,
  useEffect,
  useMemo,
  forwardRef,
  useRef,
  useImperativeHandle
} = React;

const getWrapperComponentName = (componentId: string) => `${capitalize(componentId)}MasonWrapper`;

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

const reducer = (state: State, { type, payload }) => {
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

type IRendererContext = {
  state: State;
  dispatch: Dispatch;
};

const context = createContext<IRendererContext>(null as any);

const wrappedDispatch = (
  dispatch: Dispatch,
  validations: Array<IValidationConfig> = [],
  options?: {
    onStateChange?: IRendererOptions["onStateChange"];
    validators?: ValidatorFunctionsMap;
  }
) => ({ type, payload }) => {
  const isValuedBeingUpdated = type === "UPDATE_PROP" && payload.prop === "value";
  if (isValuedBeingUpdated) {
    const { value, id: fieldId } = payload;
    const validationErrors = validator(validations, value, { validators: options && options.validators });
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
  return state;
};

function constructStateFromValue(config: IConfigNode | Array<IConfigNode>, state: State, values: Map<string, any>) {
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

function determineValidationStatus(
  config: IConfigNode | IConfigNode[],
  state: State,
  isValid: boolean,
  options?: { validators?: ValidatorFunctionsMap }
) {
  if (Array.isArray(config)) {
    return config.reduce(
      (acc: boolean, configNode: IConfigNode) => acc && determineValidationStatus(configNode, state, isValid, options),
      isValid
    );
  }
  if (config.validations) {
    const validationErrors = validator(config.validations, state[config.id].value, {
      validators: options && options.validators
    });
    const hasErrors = Object.values(validationErrors).some(Boolean);
    if (hasErrors) return false;
  }
  if (config.children) {
    return determineValidationStatus(config.children, state, isValid, options);
  }
  return true;
}

const RootComponentCore = forwardRef<any, { initialState: State; instance: ReactConfigRenderer }>(
  ({ children, initialState = {}, instance }, ref) => {
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
    instance.isInvalid = !determineValidationStatus(instance.config.config, state, true, {
      validators: instance.options.validators
    });

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
  }
);

export const RootComponent = memo(RootComponentCore);

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
  private componentsMap: Map<string, React.ExoticComponent> = new Map();
  readonly config: IConfig;
  private elementsMap: Map<string, React.ComponentType<any>>;
  public options: IRendererOptions;
  private currentRootStateSnapshot: State;
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
    const { dataProcessors = {}, onStateChange, resolvers, validators } = this.options;

    const elementComponent = this.elementsMap.get(type);
    if (!elementComponent) {
      throw new Error(`No component exists for type ${type}`);
    }
    const wrappedComponent: React.NamedExoticComponent<{ style: IObject; resolvers: FunctionsMap; id: string }> = memo(
      props => {
        /** Getting the reducer context as a consumer for reading the state and dispatching actions */
        const { state: rootState, dispatch } = useContext(context);

        const rootDispatch = wrappedDispatch(dispatch, validations, { onStateChange, validators });
        this.currentRootStateSnapshot = rootState;

        /** Creating the event handlers out of the events config */
        const eventsMap = useMemo(() => {
          return Object.entries(events).reduce((eventsObj, [eventName, eventConfig]) => {
            const eventHandler = (event: Event, value?: any) => {
              /** Executing multiple event handlers in case an array is provided against an event type in config */
              if (Array.isArray(eventConfig)) {
                eventConfig.forEach(config => {
                  handleEvent(
                    config,
                    { id, event, dataProcessors, value, resolvers: props.resolvers },
                    rootDispatch,
                    rootState
                  );
                });
              } else {
                handleEvent(
                  eventConfig,
                  { id, event, dataProcessors, value, resolvers: props.resolvers },
                  rootDispatch,
                  rootState
                );
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
            handleEvent(data, { id, dataProcessors, resolvers: props.resolvers }, rootDispatch, rootState);
          }
        }, []);

        const disabledEvaluated = evaluateDisabledClause(disabled, {
          rootState,
          resolvers: props.resolvers,
          instance: this
        });

        /** Constructing the original component by setting its props from the rootState and returning it */
        const component = useMemo(
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
      }
    );
    const displayName = getWrapperComponentName(id);
    let component;
    if (this.componentsMap.has(displayName)) {
      component = this.componentsMap.get(displayName);
    } else {
      wrappedComponent.displayName = getWrapperComponentName(id);
      this.componentsMap.set(displayName, wrappedComponent);
      component = wrappedComponent;
    }
    // wrappedComponent.whyDidYouRender = true;
    const el = createElement(
      component,
      { key: id, style, id, resolvers },
      ...(children ? children.map(this.renderConfigNode) : [])
    );
    // this.components.set(id, el);
    return el;
  }

  checkIfValuesPristine(rootState: State) {
    return Object.values(rootState).reduce((acc, { value, initialValue }) => {
      if (typeof initialValue === "undefined") return acc && !value;
      return acc && JSON.stringify(initialValue) === JSON.stringify(value);
    }, true);
  }

  constructInitialState(config: IConfigNode | Array<IConfigNode>, initialState) {
    const { initialValues } = this.options;
    return constructStateFromValue(config, initialState, initialValues);
  }

  getValuesFromState(state: State) {
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
    return memo((props: { resolvers?: FunctionsMap }) => {
      const { config } = this.config;
      if (props.resolvers) {
        this.options.resolvers = props.resolvers;
      }
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
