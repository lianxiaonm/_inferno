import { isUndefined, throwError } from 'inferno-shared'
import { extend } from './common';

let caches = {};

const $cacheFactory = function (cacheId, options) {
    if (cacheId in caches)
        throwError('iid', cacheId + ' is in!');
    let size = 0,
        stats = extend({}, options, {
            id: cacheId
        }),
        data = {},
        capacity = (options && options.capacity) || Number.MAX_VALUE,
        lruHash = {},
        freshEnd = null,
        staleEnd = null,
        MAX_VALUE = Number.MAX_VALUE;
    return caches[cacheId] = {
        put: function (key, value) {
            capacity < MAX_VALUE &&
            refresh(lruHash[key] || (lruHash[key] = {
                    key: key
                }));
            if (isUndefined(value)) return;
            key in data || size++;
            data[key] = value;
            size > capacity && this.remove(staleEnd.key);
            return value;
        },
        get: function (key) {
            if (capacity < MAX_VALUE) {
                var lruEntry = lruHash[key];
                if (!lruEntry) return;
                refresh(lruEntry);
            }
            return data[key];
        },
        remove: function (key) {
            if (capacity < MAX_VALUE) {
                var lruEntry = lruHash[key];
                if (!lruEntry) return;
                if (lruEntry == freshEnd) freshEnd = lruEntry.p;
                if (lruEntry == staleEnd) staleEnd = lruEntry.n;
                link(lruEntry.n, lruEntry.p);
                delete lruHash[key];
            }
            delete data[key];
            size--;
        },
        removeAll: function () {
            data = {};
            size = 0;
            lruHash = {};
            freshEnd = staleEnd = null;
        },
        destroy: function () {
            data = stats = lruHash = null;
            delete caches[cacheId];
        },
        info: function () {
            return extend({}, stats, {
                size: size
            });
        }
    };
    function refresh(entry) {
        if (entry != freshEnd) {
            staleEnd = !staleEnd ? entry : staleEnd == entry ?
                entry.n : staleEnd;
            link(entry.n, entry.p);
            link(entry, freshEnd);
            freshEnd = entry;
            freshEnd.n = null;
        }
    }

    function link(nextEntry, prevEntry) {
        if (nextEntry != prevEntry) {
            if (nextEntry) nextEntry.p = prevEntry;
            if (prevEntry) prevEntry.n = nextEntry;
        }
    }
};
$cacheFactory.info = function () {
    var info = {};
    for (var name in caches) {
        info[name] = caches[name].info();
    }
    return info;
};
$cacheFactory.get = function (cacheId) {
    return caches[cacheId];
};
export default $cacheFactory;
