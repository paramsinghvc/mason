import {
  IDataAjaxConfig,
  IDataSetDatasourceConfig,
  IDataSetValueConfig,
  IEventsConfig,
  ICustomHandlerConfig,
  State,
  Dispatch
} from "./types";
import { processValue } from "./shared";
import { booleanProcessor } from "./booleanProcessor";

interface IOptions {
  id: string;
  event?: Event | null;
  value?: any;
  dataProcessors: {};
  resolvers: {};
}

const formQueryString = (queryParams, rootState: State, selfValue) =>
  Object.entries(queryParams)
    .reduce((acc: Array<string>, [key, value]) => {
      acc.push(`${key}=${processValue(value as string, rootState, selfValue)}`);
      return acc;
    }, [])
    .join("&");

export const handleEvent = (
  eventConfig: IEventsConfig,
  { id, event = null, dataProcessors, value = undefined, resolvers }: IOptions,
  rootDispatch: Dispatch,
  rootState: State
) => {
  const { type, when } = eventConfig;

  /**
   * Checking if the when clause/config is passed into the event config, process it by passing through
   * the boolean processor and stop proceeding if it returns falsy
   */
  if (when) {
    const shouldProceed = booleanProcessor(when, rootState, value);
    if (shouldProceed === false) {
      return;
    }
  }
  switch (type) {
    case "AJAX_CALL":
      {
        const {
          endpoint,
          queryParams,
          dataProcessor,
          fieldId,
          fieldIds,
          credentials = "omit"
        } = (eventConfig as IDataAjaxConfig).meta;

        rootDispatch({
          type: "UPDATE_PROP",
          payload: {
            id: fieldId || id,
            prop: "loading",
            value: true
          }
        });

        if (rootState[fieldId || id] && rootState[fieldId || id].error) {
          rootDispatch({
            type: "UPDATE_PROP",
            payload: {
              id: fieldId || id,
              prop: "error",
              value: null
            }
          });
        }

        fetch(
          `${endpoint}?${
            queryParams
              ? formQueryString(
                  queryParams,
                  rootState,
                  value !== undefined ? value : event ? (event.target as HTMLFormElement).value : null
                )
              : ""
          }`,
          {
            credentials
          }
        )
          .then(response => {
            if (response.ok) return response.json();
            throw response;
          })
          .then(result => (dataProcessor && dataProcessors[dataProcessor] ? dataProcessors[dataProcessor](result) : result))
          .then(result => {
            rootDispatch({
              type: "UPDATE_PROP",
              payload: {
                id: fieldId || id,
                prop: "loading",
                value: false
              }
            });
            /** If datasource of multiple elements (usually children) needs to be set, fieldIds needs to be intercepted */
            if (fieldIds) {
              for (const [fieldIdTemp, fieldDataProcessor] of Object.entries(fieldIds)) {
                rootDispatch({
                  type: "UPDATE_PROP",
                  payload: {
                    id: fieldIdTemp,
                    prop: "datasource",
                    value: dataProcessors && dataProcessors[fieldDataProcessor] && dataProcessors[fieldDataProcessor](result)
                  }
                });
              }
            } else {
              rootDispatch({
                type: "UPDATE_PROP",
                payload: {
                  id: fieldId || id,
                  prop: "datasource",
                  value: result
                }
              });
            }
          })
          .catch(e => {
            rootDispatch({
              type: "UPDATE_PROP",
              payload: {
                id: fieldId || id,
                prop: "loading",
                value: false
              }
            });

            if (e instanceof Response) {
              e.text().then(error => {
                console.error(`Error while fetching datasource: `, error);
                rootDispatch({
                  type: "UPDATE_PROP",
                  payload: {
                    id: fieldId || id,
                    prop: "error",
                    value: error
                  }
                });
              });
            } else {
              console.error(`Error while fetching datasource: `, e);
              rootDispatch({
                type: "UPDATE_PROP",
                payload: {
                  id: fieldId || id,
                  prop: "error",
                  value: (e as TypeError).message
                }
              });
            }
          });
      }
      break;
    case "SET_DATASOURCE":
      {
        let resolvedDataSource;
        const { data, fieldId, dataResolver } = (eventConfig as IDataSetDatasourceConfig).meta;
        if (resolvers && resolvers[dataResolver]) {
          resolvedDataSource = resolvers[dataResolver]({ event, value, id });
        }
        rootDispatch({
          type: "UPDATE_PROP",
          payload: {
            id: fieldId || id,
            prop: "datasource",
            value: data || resolvedDataSource
          }
        });
      }
      break;
    case "SET_VALUE":
      {
        const { meta } = eventConfig as IDataSetValueConfig;
        let finalValue = null;
        if (typeof meta !== "undefined" && meta.value) {
          finalValue = meta.value;
        } else if (typeof value !== "undefined") {
          finalValue = value;
        } else {
          finalValue = event && (event.target as HTMLFormElement).value;
        }

        rootDispatch({
          type: "UPDATE_PROP",
          payload: {
            id: (meta && meta.fieldId) || id,
            prop: "value",
            value: finalValue
          }
        });
      }
      break;
    case "CUSTOM":
      {
        const { meta } = eventConfig as ICustomHandlerConfig;
        if (resolvers && resolvers[meta.name]) {
          resolvers[meta.name]({ event, value, id });
        }
      }
      break;
    default:
      throw new Error("No valid data type provided in config");
  }
};
