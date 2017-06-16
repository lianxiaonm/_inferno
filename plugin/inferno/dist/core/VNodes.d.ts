import VNodeFlags from 'inferno-vnode-flags';
export declare type InfernoInput = VNode | null | string | number;
export declare type Ref = Function | null;
export declare type InfernoChildren = string | number | VNode | Array<string | number | VNode> | null;
export declare type Type = string | Function | null;
export interface Props {
    children?: InfernoChildren;
    ref?: Ref;
    key?: any;
    className?: string;
    [k: string]: any;
}
export interface Refs {
    onComponentDidMount?: (domNode: Element) => void;
    onComponentWillMount?(): void;
    onComponentShouldUpdate?(lastProps: any, nextProps: any): boolean;
    onComponentWillUpdate?(lastProps: any, nextProps: any): void;
    onComponentDidUpdate?(lastProps: any, nextProps: any): void;
    onComponentWillUnmount?(domNode: Element): void;
}
export interface VNode {
    children: InfernoChildren;
    dom: Element | null;
    className: string;
    flags: VNodeFlags;
    key: any;
    props: Props | null;
    ref: Ref;
    type: Type;
    parentVNode?: VNode;
}
export declare function createVNode(flags: VNodeFlags, type?: Type, className?: string, children?: InfernoChildren, props?: Props, key?: any, ref?: Ref, noNormalise?: boolean): VNode;
export declare function directClone(vNodeToClone: VNode): VNode;
export declare function cloneVNode(vNodeToClone: VNode, props?: Props, ..._children: InfernoChildren[]): VNode;
export declare function createVoidVNode(): VNode;
export declare function createTextVNode(text: string | number, key: any): VNode;
export declare function isVNode(o: VNode): boolean;
