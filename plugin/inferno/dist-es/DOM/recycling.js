import { isNull, isUndefined } from 'inferno-shared';
import { patchComponent, patchElement } from './patching';
const componentPools = new Map();
const elementPools = new Map();
export function recycleElement(vNode, lifecycle, context, isSVG) {
    const tag = vNode.type;
    const pools = elementPools.get(tag);
    if (!isUndefined(pools)) {
        const key = vNode.key;
        const pool = key === null ? pools.nonKeyed : pools.keyed.get(key);
        if (!isUndefined(pool)) {
            const recycledVNode = pool.pop();
            if (!isUndefined(recycledVNode)) {
                patchElement(recycledVNode, vNode, null, lifecycle, context, isSVG, true);
                return vNode.dom;
            }
        }
    }
    return null;
}
export function poolElement(vNode) {
    const tag = vNode.type;
    const key = vNode.key;
    let pools = elementPools.get(tag);
    if (isUndefined(pools)) {
        pools = {
            nonKeyed: [],
            keyed: new Map()
        };
        elementPools.set(tag, pools);
    }
    if (isNull(key)) {
        pools.nonKeyed.push(vNode);
    }
    else {
        let pool = pools.keyed.get(key);
        if (isUndefined(pool)) {
            pool = [];
            pools.keyed.set(key, pool);
        }
        pool.push(vNode);
    }
}
export function recycleComponent(vNode, lifecycle, context, isSVG) {
    const type = vNode.type;
    const pools = componentPools.get(type);
    if (!isUndefined(pools)) {
        const key = vNode.key;
        const pool = key === null ? pools.nonKeyed : pools.keyed.get(key);
        if (!isUndefined(pool)) {
            const recycledVNode = pool.pop();
            if (!isUndefined(recycledVNode)) {
                const flags = vNode.flags;
                const failed = patchComponent(recycledVNode, vNode, null, lifecycle, context, isSVG, flags & 4 /* ComponentClass */, true);
                if (!failed) {
                    return vNode.dom;
                }
            }
        }
    }
    return null;
}
export function poolComponent(vNode) {
    const hooks = vNode.ref;
    const nonRecycleHooks = hooks && (hooks.onComponentWillMount ||
        hooks.onComponentWillUnmount ||
        hooks.onComponentDidMount ||
        hooks.onComponentWillUpdate ||
        hooks.onComponentDidUpdate);
    if (nonRecycleHooks) {
        return;
    }
    const type = vNode.type;
    const key = vNode.key;
    let pools = componentPools.get(type);
    if (isUndefined(pools)) {
        pools = {
            nonKeyed: [],
            keyed: new Map()
        };
        componentPools.set(type, pools);
    }
    if (isNull(key)) {
        pools.nonKeyed.push(vNode);
    }
    else {
        let pool = pools.keyed.get(key);
        if (isUndefined(pool)) {
            pool = [];
            pools.keyed.set(key, pool);
        }
        pool.push(vNode);
    }
}
