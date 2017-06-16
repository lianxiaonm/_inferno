import { LifecycleClass } from 'inferno-shared';
import { VNode } from '../core/VNodes';
export declare function unmount(vNode: VNode, parentDom: Element, lifecycle: LifecycleClass, canRecycle: boolean, isRecycling: boolean): void;
export declare function unmountComponent(vNode: VNode, parentDom: Element, lifecycle: LifecycleClass, canRecycle: boolean, isRecycling: boolean): void;
export declare function unmountElement(vNode: VNode, parentDom: Element, lifecycle: LifecycleClass, canRecycle: boolean, isRecycling: boolean): void;
