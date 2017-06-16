import { isArray, isInvalid, isNullOrUndef, isStatefulComponent, isUndefined, isStringOrNumber, combineFrom } from 'inferno-shared';
import { normalize } from './normalization';
import options from './options';
import { EMPTY_OBJ } from '../DOM/utils';
export function createVNode(flags, type, className, children, props, key, ref, noNormalise) {
    if (flags & 16 /* ComponentUnknown */) {
        flags = isStatefulComponent(type) ? 4 /* ComponentClass */ : 8 /* ComponentFunction */;
    }
    const vNode = {
        children: isUndefined(children) ? null : children,
        className,
        dom: null,
        flags,
        key: isUndefined(key) ? null : key,
        props: props || null,
        ref: ref || null,
        type
    };
    if (!noNormalise) {
        normalize(vNode);
    }
    if (options.createVNode) {
        options.createVNode(vNode);
    }
    return vNode;
}
export function directClone(vNodeToClone) {
    let newVNode;
    const flags = vNodeToClone.flags;
    if (flags & 28 /* Component */) {
        let props;
        const propsToClone = vNodeToClone.props;
        if (!propsToClone) {
            props = EMPTY_OBJ;
        }
        else {
            props = {};
            for (const key in propsToClone) {
                props[key] = propsToClone[key];
            }
        }
        newVNode = createVNode(flags, vNodeToClone.type, vNodeToClone.className, null, props, vNodeToClone.key, vNodeToClone.ref, true);
        const newProps = newVNode.props;
        if (newProps) {
            const newChildren = newProps.children;
            // we need to also clone component children that are in props
            // as the children may also have been hoisted
            if (newChildren) {
                if (isArray(newChildren)) {
                    const len = newChildren.length;
                    if (len > 0) {
                        const tmpArray = [];
                        for (let i = 0; i < len; i++) {
                            const child = newChildren[i];
                            if (isStringOrNumber(child)) {
                                tmpArray.push(child);
                            }
                            else if (!isInvalid(child) && isVNode(child)) {
                                tmpArray.push(directClone(child));
                            }
                        }
                        newProps.children = tmpArray;
                    }
                }
                else if (isVNode(newChildren)) {
                    newProps.children = directClone(newChildren);
                }
            }
        }
        newVNode.children = null;
    }
    else if (flags & 3970 /* Element */) {
        const children = vNodeToClone.children;
        let props;
        const propsToClone = vNodeToClone.props;
        if (!propsToClone) {
            props = EMPTY_OBJ;
        }
        else {
            props = {};
            for (const key in propsToClone) {
                props[key] = propsToClone[key];
            }
        }
        newVNode = createVNode(flags, vNodeToClone.type, vNodeToClone.className, children, props, vNodeToClone.key, vNodeToClone.ref, !children);
    }
    else if (flags & 1 /* Text */) {
        newVNode = createTextVNode(vNodeToClone.children, vNodeToClone.key);
    }
    return newVNode;
}
/*
 directClone is preferred over cloneVNode and used internally also.
 This function makes Inferno backwards compatible.
 And can be tree-shaked by modern bundlers

 Would be nice to combine this with directClone but could not do it without breaking change
 */
export function cloneVNode(vNodeToClone, props, ..._children) {
    let children = _children;
    const childrenLen = _children.length;
    if (childrenLen > 0 && !isUndefined(_children[0])) {
        if (!props) {
            props = {};
        }
        if (childrenLen === 1) {
            children = _children[0];
        }
        if (!isUndefined(children)) {
            props.children = children;
        }
    }
    let newVNode;
    if (isArray(vNodeToClone)) {
        const tmpArray = [];
        for (let i = 0, len = vNodeToClone.length; i < len; i++) {
            tmpArray.push(directClone(vNodeToClone[i]));
        }
        newVNode = tmpArray;
    }
    else {
        const flags = vNodeToClone.flags;
        const className = vNodeToClone.className || (props && props.className) || null;
        const key = !isNullOrUndef(vNodeToClone.key) ? vNodeToClone.key : (props ? props.key : null);
        const ref = vNodeToClone.ref || (props ? props.ref : null);
        if (flags & 28 /* Component */) {
            newVNode = createVNode(flags, vNodeToClone.type, className, null, (!vNodeToClone.props && !props) ? EMPTY_OBJ : combineFrom(vNodeToClone.props, props), key, ref, true);
            const newProps = newVNode.props;
            if (newProps) {
                const newChildren = newProps.children;
                // we need to also clone component children that are in props
                // as the children may also have been hoisted
                if (newChildren) {
                    if (isArray(newChildren)) {
                        const len = newChildren.length;
                        if (len > 0) {
                            const tmpArray = [];
                            for (let i = 0; i < len; i++) {
                                const child = newChildren[i];
                                if (isStringOrNumber(child)) {
                                    tmpArray.push(child);
                                }
                                else if (!isInvalid(child) && isVNode(child)) {
                                    tmpArray.push(directClone(child));
                                }
                            }
                            newProps.children = tmpArray;
                        }
                    }
                    else if (isVNode(newChildren)) {
                        newProps.children = directClone(newChildren);
                    }
                }
            }
            newVNode.children = null;
        }
        else if (flags & 3970 /* Element */) {
            children = (props && !isUndefined(props.children)) ? props.children : vNodeToClone.children;
            newVNode = createVNode(flags, vNodeToClone.type, className, children, (!vNodeToClone.props && !props) ? EMPTY_OBJ : combineFrom(vNodeToClone.props, props), key, ref, !children);
        }
        else if (flags & 1 /* Text */) {
            newVNode = createTextVNode(vNodeToClone.children, key);
        }
    }
    return newVNode;
}
export function createVoidVNode() {
    return createVNode(4096 /* Void */);
}
export function createTextVNode(text, key) {
    return createVNode(1 /* Text */, null, null, text, null, key);
}
export function isVNode(o) {
    return !!o.flags;
}
