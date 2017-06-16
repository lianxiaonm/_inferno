import { LifecycleClass } from 'inferno-shared';
import { InfernoInput, InfernoChildren } from '../core/VNodes';
export interface Root {
    dom: Node | SVGAElement;
    input: InfernoInput;
    lifecycle: LifecycleClass;
}
export declare const roots: Root[];
export declare const componentToDOMNodeMap: Map<any, any>;
export declare function findDOMNode(ref: any): any;
export declare function render(input: InfernoInput, parentDom?: Element | SVGAElement | DocumentFragment): InfernoChildren;
export declare function createRenderer(parentDom?: any): (lastInput: any, nextInput: any) => void;
