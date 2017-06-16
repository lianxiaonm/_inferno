export declare const NO_OP = "$NO_OP";
export declare const ERROR_MSG = "a runtime error occured! Use Inferno in development environment to find the error.";
export declare const isBrowser: boolean;
export declare function toArray(children: any): any[];
export declare const isArray: (arg: any) => arg is any[];
export declare function isStatefulComponent(o: any): boolean;
export declare function isStringOrNumber(obj: any): boolean;
export declare function isNullOrUndef(obj: any): boolean;
export declare function isInvalid(obj: any): boolean;
export declare function isFunction(obj: any): boolean;
export declare function isString(obj: any): boolean;
export declare function isNumber(obj: any): boolean;
export declare function isNull(obj: any): boolean;
export declare function isTrue(obj: any): boolean;
export declare function isUndefined(obj: any): boolean;
export declare function isObject(o: any): boolean;
export declare function throwError(message?: string): void;
export declare function warning(message: string): void;
export declare function combineFrom(first: {}, second: {}): any;
export interface LifecycleClass {
    listeners: Function[];
    addListener(callback: Function): void;
    trigger(): void;
}
export declare function Lifecycle(): void;
