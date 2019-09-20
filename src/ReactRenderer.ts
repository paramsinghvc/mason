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
import { IConfigRenderer, IConfig, IConfigNode, IValidationConfig } from "./types";
import { handleEvent } from "./eventHandling";
import { validator } from "./validator";

// import produce from "immer";
import { booleanProcessor } from "./booleanProcessor";
import { capitalize } from "./shared";

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
  onStateChange?: (state: { [k: string]: any }) => void;
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
  dispatch: React.Dispatch<{ type: string; payload: any }>,
  validations: Array<IValidationConfig> = []
) => ({ type, payload }) => {
  if (type === "UPDATE_PROP" && payload.prop === "value") {
    const { value, id: fieldId } = payload;
    const validationErrors = validator(validations, value);

    dispatch({
      type: "UPDATE_PROP",
      payload: {
        id: fieldId,
        prop: "validations",
        value: validationErrors
      }
    });
  }
  return dispatch({ type, payload });
};

function constructStateFromValue(config: IConfigNode, state, values: Map<string, any>) {
  const { meta, id, children } = config;
  if (values && values.get(id)) {
    state[id] = { ...(state[id] || {}), value: values.get(id) };
  } else if (meta && typeof meta.value !== "undefined") {
    state[id] = { ...(state[id] || {}), value: meta.value };
  }
  if (children) {
    children.forEach(childConfigNode => constructStateFromValue(childConfigNode, state, values));
  }
  return state;
}

const RootComponentCore: React.ForwardRefExoticComponent<{
  initialState: any;
  onStateChange?: IRendererOptions["onStateChange"];
}> = forwardRef(({ children, initialState = {}, onStateChange }, ref) => {
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
  onStateChange && onStateChange(state);
  return createElement(
    context.Provider,
    {
      value: {
        state,
        dispatch
      }
    },
    children
  );
});

export const RootComponent: React.NamedExoticComponent<any> = memo(RootComponentCore);

type IObject = {
  [k: string]: any;
};

// const eventsSeedValue = {};

export class ReactConfigRenderer implements IConfigRenderer<React.ReactNode> {
  private components: Map<string, React.Component> = new Map();
  readonly config: IConfig;
  private elementsMap: Map<string, React.ComponentType<any>>;
  private options: IObject;
  private currentRootStateSnapshot: IObject;
  private rootComponentRef: React.MutableRefObject<any> | null;
  constructor(config: IConfig, elementsMap: Map<string, React.ComponentType<any>>, options?: IRendererOptions) {
    this.config = config;
    this.elementsMap = elementsMap;
    this.options = options || {};
    this.renderConfigNode = this.renderConfigNode.bind(this);
    this.currentRootStateSnapshot = {};
    this.rootComponentRef = null;
  }
  renderConfigNode(node: IConfigNode) {
    const { id, type, meta = {}, data, events = {}, validations, children, style, show } = node;
    const { dataProcessors = {} } = this.options;
    // if (this.components.has(id)) return this.components.get(id);
    const elementComponent = this.elementsMap.get(type);
    if (!elementComponent) {
      throw new Error(`No component exists for type ${type}`);
    }
    const wrappedComponent: React.MemoExoticComponent<any> & { whyDidYouRender?: boolean } = memo(props => {
      /** Getting the reducer context as a consumer for reading the state and dispatching actions */
      const { state: rootState, dispatch } = useContext(context);
      const rootDispatch = wrappedDispatch(dispatch, validations);
      this.currentRootStateSnapshot = rootState;
      /** Creating the event handlers out of the events config */
      const eventsMap = useMemo(() => {
        return Object.entries(events).reduce((eventsObj, [eventName, eventConfig]) => {
          const eventHandler = (event: Event, value?: any) => {
            /** Executing multiple event handlers in case an array is provided against an event type in config */
            if (Array.isArray(eventConfig)) {
              eventConfig.forEach(config => {
                handleEvent(config, { id, event, dataProcessors, value }, rootDispatch, rootState);
              });
            } else {
              handleEvent(eventConfig, { id, event, dataProcessors, value }, rootDispatch, rootState);
            }
          };
          eventsObj[eventName] = eventHandler;
          return eventsObj;
        }, {});
      }, [events, rootState]);

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
          handleEvent(data, { id, dataProcessors }, rootDispatch, rootState);
        }
      }, []);

      /** Constructing the original component by setting its props from the rootState and returning it */
      const component = React.useMemo(
        () =>
          createElement(
            elementComponent,
            { ...(rootState[id] ? rootState[id] : { ...meta, ...props }), ...eventsMap },
            props.children
          ),
        [rootState[id], eventsMap]
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

  constructInitialState(config: IConfigNode, initialState) {
    const { initialValues } = this.options;
    return constructStateFromValue(config, initialState, initialValues);
  }

  getCurrentValuesSnapshot() {
    return Object.entries(this.currentRootStateSnapshot).reduce((acc, [key, val]) => {
      if (typeof val.value !== "undefined") {
        acc[key] = val.value;
      }
      return acc;
    }, {});
  }

  public setValue(val) {
    if (this.rootComponentRef) {
      this.rootComponentRef.current.setRootState(this.config.config, val);
    }
  }

  render() {
    const { config } = this.config;
    const initialState = this.constructInitialState(config, {});
    this.rootComponentRef = useRef();
    return createElement(
      RootComponent,
      { initialState, ref: this.rootComponentRef, onStateChange: this.options.onStateChange },
      [this.renderConfigNode(config)]
    );
  }
}
