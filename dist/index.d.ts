
export declare const RootComponent: React.MemoExoticComponent<React.ForwardRefExoticComponent<{
    initialState: State;
    instance: ReactConfigRenderer;
} & React.RefAttributes<any>>>;
export declare class ReactConfigRenderer implements IConfigRenderer<React.ReactNode> {
    private componentsMap;
    readonly config: IConfig;
    private elementsMap;
    options: IRendererOptions;
    private currentRootStateSnapshot;
    private rootComponentRef;
    hasErrors: boolean;
    isPristine: boolean;
    isInvalid: boolean;
    constructor(config: IConfig, elementsMap: IObject<React.ComponentType<any>>, options?: IRendererOptions);
    renderConfigNode(node: IConfigNode): any;
    checkIfValuesPristine(rootState: State): boolean;
    constructInitialState(config: IConfigNode | Array<IConfigNode>, initialState: any): State;
    getValuesFromState(state: State): {};
    getCurrentValuesSnapshot(): {};
    setValue(val: any): void;
    render(): React.MemoExoticComponent<(props: {
        resolvers?: FunctionsMap<any, any>;
    }) => React.FunctionComponentElement<{
        initialState: State;
        instance: ReactConfigRenderer;
    } & React.RefAttributes<any>>>;
}

export declare const booleanProcessor: (booleanClause: boolean | import("./types").ConditionalConfig, rootState: State, selfValue?: any) => boolean;

interface IOptions {
    id: string;
    event?: Event | null;
    value?: any;
    dataProcessors: {};
    resolvers: {};
}
export declare const handleEvent: (eventConfig: IEventsConfig, { id, event, dataProcessors, value, resolvers }: IOptions, rootDispatch: import("./types").StateReturnableDispatch<import("./types").ActionType>, rootState: State) => void;

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
export declare type ConditionalConfig = {
    type: OperationType;
    operator: ComparisonOperators | CompoundOperators;
    leftOperand: string | ConditionalConfig;
    rightOperand: string | ConditionalConfig;
};
export declare type BooleanConfig = ConditionalConfig;
export declare type DisabledConfig = ConditionalConfig;
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
        fieldIds?: {
            [k: string]: string;
        };
    };
}
export interface IDataSetValueConfig {
    type: "SET_VALUE";
    meta: {
        value?: any;
        fieldId?: string;
        name?: string;
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
export declare type IObject<T = any> = {
    [k: string]: T;
};
export declare type State = {
    [id: string]: {
        value: any;
        initialValue: any;
        validations?: {
            hasErrors: boolean;
            errors: IObject;
        };
        [key: string]: any;
    };
};
export declare type StateReturnableDispatch<A> = (value: A) => State;
export declare type ActionType = {
    type: string;
    payload: any;
};
export declare type Dispatch = StateReturnableDispatch<ActionType>;
export declare type FunctionsMap<T = any, U = any> = {
    [k: string]: (a: T) => U;
};
export declare type ValidatorFunctionsMap = FunctionsMap<any, string | undefined | null>;
export declare type IRendererOptions = {
    initialValues?: IObject;
    dataProcessors?: FunctionsMap;
    resolvers?: FunctionsMap;
    validators?: ValidatorFunctionsMap;
    onStateChange?: (state: State) => void;
    onErrorStateChange?: (hasErrors: boolean) => void;
};

export declare const validator: (validations: IValidationConfig[], value: any, options?: {
    validators: import("./types").FunctionsMap<any, string>;
}) => {
    REQUIRED?: string;
    REGEX?: string;
    CUSTOM?: string;
    RANGE?: string;
    LENGTH?: string;
    JSON?: string;
};
