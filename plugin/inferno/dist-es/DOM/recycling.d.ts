import { LifecycleClass } from 'inferno-shared';
import { VNode } from '../core/VNodes';
export declare function recycleElement(vNode: VNode, lifecycle: LifecycleClass, context: Object, isSVG: boolean): Element;
export declare function poolElement(vNode: VNode): void;
export declare function recycleComponent(vNode: VNode, lifecycle: LifecycleClass, context: Object, isSVG: boolean): Element;
export declare function poolComponent(vNode: VNode): void;
