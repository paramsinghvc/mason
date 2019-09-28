
export declare type ActionType = {
    type: string;
    payload: any;
};
export declare type IRendererOptions = {
    initialValues?: Map<string, any>;
    dataProcessors?: {
        [k: string]: (a: any) => any;
    };
    onStateChange?: (state: {
        [k: string]: any;
    }) => void;
};
export declare const RootComponent: React.NamedExoticComponent<any>;
export declare class ReactConfigRenderer implements IConfigRenderer<React.ReactNode> {
    private components;
    readonly config: IConfig;
    private elementsMap;
    private options;
    private currentRootStateSnapshot;
    private rootComponentRef;
    constructor(config: IConfig, elementsMap: Map<string, React.ComponentType<any>>, options?: IRendererOptions);
    renderConfigNode(node: IConfigNode): any;
    constructInitialState(config: IConfigNode, initialState: any): any;
    getCurrentValuesSnapshot(): {};
    setValue(val: any): void;
    render(): any;
}

export declare const booleanProcessor: (booleanClause: boolean | BooleanConfig, rootState: any, selfValue?: any) => boolean;

interface IOptions {
    id: string;
    event?: Event | null;
    value?: any;
    dataProcessors: {};
}
export declare const handleEvent: (eventConfig: IEventsConfig, { id, event, dataProcessors, value }: IOptions, rootDispatch: any, rootState: any) => void;

export * from "./ReactRenderer";

export declare const processValue: (value: string, rootState: {
    [k: string]: any;
}, selfValue?: string) => string;
export declare const capitalize: (str: string) => string;

export interface ITypeMeta {
    type: string;
    meta?: any;
}
/** Boolean Configs */
export declare enum ComparisonOperators {
    EQ = "=",
    NOT_EQ = "!=",
    LT = "<",
    LTE = "<=",
    GT = ">",
    GTE = ">="
}
export declare enum CompoundOperators {
    AND = "&&",
    OR = "||"
}
export declare enum OperationType {
    ATOMIC = "ATOMIC",
    COMPOUND = "COMPOUND"
}
export declare type BooleanConfig = {
    type: OperationType;
    operator: ComparisonOperators | CompoundOperators;
    leftOperand: string | BooleanConfig;
    rightOperand: string | BooleanConfig;
};
/** Boolean Configs */
/** Validator Types */
export declare enum ValidationTypes {
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
export declare type IDataFieldConfig = IDataSetDatasourceConfig | IDataAjaxConfig | IDataAjaxConfig;
export interface IEventsConfig extends ITypeMeta {
    type: "AJAX_CALL" | "SET_DATASOURCE" | "SET_VALUE";
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
        fieldIds?: {
            [k: string]: string;
        };
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
export interface IConfigNode {
    id: string;
    type: string;
    children?: Array<IConfigNode>;
    meta?: any;
    style?: any;
    show?: boolean | BooleanConfig;
    validations?: Array<IValidationConfig>;
    events?: {
        [eventName: string]: Array<IEventsConfig> | IEventsConfig;
    };
    data?: Pick<IDataFieldConfig, keyof IDataFieldConfig>;
}
export interface IConfig {
    page: string;
    config: IConfigNode;
}
export interface IConfigRenderer<ReturnNodeType = any> {
    readonly config: IConfig;
    render: () => ReturnNodeType;
}

export declare const validator: (validations: IValidationConfig[], value: any) => {
    REQUIRED?: string;
    REGEX?: string;
    CUSTOM?: string;
    RANGE?: string;
    LENGTH?: string;
    JSON?: string;
};
