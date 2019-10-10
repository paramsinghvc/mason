export interface ITypeMeta {
  type: string;
  meta?: any;
}
/** Boolean Configs */
export enum ComparisonOperators {
  EQ = "=",
  NOT_EQ = "!=",
  LT = "<",
  LTE = "<=",
  GT = ">",
  GTE = ">="
}

export enum CompoundOperators {
  AND = "&&",
  OR = "||"
}

export enum OperationType {
  ATOMIC = "ATOMIC",
  COMPOUND = "COMPOUND"
}

export type ConditionalConfig = {
  type: OperationType;
  operator: ComparisonOperators | CompoundOperators;
  leftOperand: string | ConditionalConfig;
  rightOperand: string | ConditionalConfig;
};

export type BooleanConfig = ConditionalConfig;
export type DisabledConfig = ConditionalConfig;

/** Boolean Configs */

/** Validator Types */

export enum ValidationTypes {
  REQUIRED = "REQUIRED",
  REGEX = "REGEX",
  CUSTOM = "CUSTOM",
  RANGE = "RANGE",
  LENGTH = "LENGTH",
  JSON = "JSON"
}

export interface IValidationConfig extends ITypeMeta {
  type: ValidationTypes;
}

/** Validator Types */

export type IDataFieldConfig = IDataSetDatasourceConfig | IDataAjaxConfig | IDataAjaxConfig;

export interface IEventsConfig extends ITypeMeta {
  type: "AJAX_CALL" | "SET_DATASOURCE" | "SET_VALUE" | "CUSTOM";
  when?: BooleanConfig;
}
export interface IDataAjaxConfig {
  type: "AJAX_CALL";
  meta: {
    endpoint: string;
    queryParams: {
      [k: string]: string;
    };
    credentials?: "include" | "same-origin" | "omit";
    fieldId?: string;
    dataProcessor?: string;
    fieldIds?: { [k: string]: string };
  };
}

export interface IDataSetValueConfig {
  type: "SET_VALUE";
  meta: {
    value: any;
    fieldId?: string;
  };
}

export interface IDataSetDatasourceConfig {
  type: "SET_DATASOURCE";
  meta: {
    data: any;
    fieldId?: string;
  };
}

export interface ICustomHandlerConfig {
  type: "CUSTOM";
  meta: {
    name: string;
  };
}

export interface IConfigNode {
  id: string;
  type: string;
  children?: Array<IConfigNode>;
  meta?: any;
  style?: any;
  show?: boolean | BooleanConfig;
  disabled?: boolean | DisabledConfig | ICustomHandlerConfig;
  validations?: Array<IValidationConfig>;
  events?: {
    [eventName: string]: Array<IEventsConfig> | IEventsConfig;
  };
  data?: Pick<IDataFieldConfig, keyof IDataFieldConfig>;
}

export interface IConfig {
  page: string;
  config: IConfigNode | Array<IConfigNode>;
}

export interface IConfigRenderer<ReturnNodeType = any> {
  readonly config: IConfig;
  render: () => ReturnNodeType;
}
