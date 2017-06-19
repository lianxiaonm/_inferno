import { isFunction, isUndefined, isObject, isString, isArray, isNumber, isBrowser } from 'inferno-shared'

let toString = Object.prototype.toString,
    getProto = Object.getPrototypeOf,
    arr = [],
    slice = arr.slice,
    indexOf = arr.indexOf;
/**************base****************/
export function lowercase(string) {
    return isString(string) ? string.toLowerCase() : string;
}
export function uppercase(string) {
    return isString(string) ? string.toUpperCase() : string;
}
export function fromJson(json) {
    return isString(json) ? JSON.parse(json) : json;
}
export function isDefined(obj) {
    return !isUndefined(obj);
}
export function isFile(obj) {
    return toString.call(obj) === '[object File]';
}
export function isBlob(obj) {
    return toString.call(obj) === '[object Blob]';
}
export function isWindow(obj) {
    return obj && obj.window === obj;
}
export function valueFn(value) {
    return function () {return value;}
}
export function isArrayLike(obj) {
    if (obj == null || isWindow(obj))
        return false;
    var length = obj.length;
    return isString(obj) || isArray(obj) || length === 0 ||
        isNumber(length) && length > 0 && (length - 1) in obj;
}
export function includes(array, obj) {
    return indexOf.call(array, obj) != -1;
}
export function toJsonReplacer(key, val) {
    return /^\$\$/.test(key) ? undefined : isWindow(val) ?
        '$WINDOW' : document === val ? '$DOCUMENT' : val;
}
export function toJson(obj, pretty) {
    return isUndefined(obj) ? undefined :
        JSON.stringify(obj, toJsonReplacer, pretty ? '  ' : null);
}
export function trim(val) {
    return isString(val) ? val.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '') : val;
}
export function toggleClass(el, clazz, isAdd) {
    return el instanceof Element && (function (clz) {
            var odClazz = el.className.split(/\s+/)
                .filter((item) => item);
            forEach(clz, function (val) {
                var index = odClazz.indexOf(val);
                isAdd ? index == -1 && odClazz.push(val)
                    : index != -1 && odClazz.splice(index, 1);
            });
            el.className = odClazz.join(' ');
        })(isArray(clazz) ? clazz : clazz.split(' '));
}
export function forEach(obj, iterator, context) {
    var key, length;
    if (isFunction(obj)) {
        var noneKeys = ['prototype', 'length', 'name'];
        for (key in obj) {
            includes(noneKeys, key) || (!obj.hasOwnProperty || obj.hasOwnProperty(key)) &&
            iterator.call(context, obj[key], key, obj);
        }
    } else if (isArray(obj) || isArrayLike(obj)) {
        var isPrimitive = !isObject(obj);
        for (key = 0, length = obj.length; key < length; key++) {
            if (isPrimitive || key in obj)
                iterator.call(context, obj[key], key, obj);
        }
    } else if (obj) {
        if (obj.forEach && obj.forEach !== forEach) obj.forEach(iterator, context, obj);
        else
            for (key in obj) {
                obj.hasOwnProperty(key) && iterator.call(context, obj[key], key, obj);
            }
    }
    return obj;
}
export function equals(o1, o2) {
    return o1 === o2 || !(o1 === null || o2 === null) && (o1 !== o1 && o2 !== o2) ||
        (function () {
            var t1 = toString.call(o1), t2 = toString.call(o2),
                length, key, keySet = {};
            if (t1 == t2 && isObject(o1)) {
                if (t1 === '[object Date]')
                    return equals(o1.getTime(), o2.getTime());
                else if (t1 === '[object RegExp]')
                    return o1.toString() == o2.toString();
                else if (t1 === '[object,Array]') {
                    if ((length = o1.length) == o2.length) {
                        for (key = 0; key < length; key++) {
                            if (!equals(o1[key], o2[key])) return false;
                        }
                        return true;
                    }
                } else {
                    if (isWindow(o1) || isWindow(o2)) return false;
                    for (key in o1) {
                        if (key[0] === '$' || isFunction(o1[key]))continue;
                        else if (!equals(o1[key], o2[key]))return false;
                        keySet[key] = true;
                    }
                    for (key in o2) {
                        if (!keySet.hasOwnProperty(key) && key[0] !== '$'
                            && !isUndefined(o2[key]) && !isFunction(o2[key])) return false;
                    }
                    return true;
                }
            }
            return false;
        })();
}
export function shallowCopy(src, dst) {
    dst = isArray(src) ? [] : {};
    isObject(src) && forEach(src, function (val, key) {
        /^\$\$/.test(val) || (dst[key] = src[key]);
    });
    return dst || src;
}
export function extend(dst) { //浅复制 TXDX
    for (var i = 1, ii = arguments.length; i < ii; i++) {
        var obj = arguments[i];
        if (obj) {
            var keys = Object.keys(obj);
            for (var j = 0, jj = keys.length; j < jj; j++) {
                var key = keys[j];
                dst[key] = obj[key];
            }
        }
    }
    return dst;
}
let F = function () {}
export function inherit(C, P) {
    F.prototype = P.prototype;
    C.prototype = new F();
    C.uber = P.prototype;
    C.prototype.constructor = C;
}
function forEachSorted(obj, iterator, context) {
    var keys = Object.keys(obj).sort();
    for (var i = 0; i < keys.length; i++) {
        iterator.call(context, obj[keys[i]], keys[i]);
    }
    return keys;
}
export function toQueryString(params) {
    var parts = [];
    forEachSorted(params, function (value, key) {
        if (value == null) return;
        if (!isArray(value)) value = [value];
        forEach(value, function (v) {
            isObject(v) ? v = v instanceof Date ? v.toISOString() : toJson(v) : '';
            parts.push(enc_URI(key) + '=' + enc_URI(v));
        });
    });
    return parts.join("&");
}
export function buildUrl(url, params) {
    if (!params) return url;
    var parts = toQueryString(params);
    if (parts.length > 0) url += (url.indexOf('?') == -1 ? '?' : '&') + parts;
    return url;
}
export function isPromiseLike(obj) {
    return obj && isFunction(obj.then);
}
export const callbacks = window.Inferno_callbacks = {counter: 0};
export function sliceArgs(args, startIndex) {
    return slice.call(args, startIndex || 0);
}
export function bind(self, fn) {
    var args = arguments,
        curryArgs = args.length > 2 ? sliceArgs(args, 2) : [];
    return isFunction(fn) ? curryArgs.length ? function () {
        args = arguments;
        return args.length ? fn.apply(self, curryArgs.concat(slice.call(args, 0)))
            : fn.apply(self, curryArgs);
    } : function () {
        return arguments.length ? fn.apply(self, arguments) : fn.call(self);
    } : fn;
}
let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
export function uuid(len, radix) {
    var i, r, uid = [];
    radix = radix || chars.length;
    if (len) {
        for (i = 0; i < len; i++) uid[i] = chars[0 | Math.random() * radix];
    } else {
        uid[8] = uid[13] = uid[18] = uid[23] = '-', uid[14] = '4';
        for (i = 0; i < 36; i++) {
            if (!uid[i]) {
                r = 0 | Math.random() * 16, uid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }
    return uid.join('');
}
let I64BIT_TABLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'.split('');
export function hash(input) {
    var hash = 5381, i = input.length - 1;
    if (typeof input == 'string') {
        for (; i > -1; i--)
            hash += (hash << 5) + input.charCodeAt(i);
    } else {
        for (; i > -1; i--)
            hash += (hash << 5) + input[i];
    }
    var value = hash & 0x7FFFFFFF, retValue = '';
    do {
        retValue += I64BIT_TABLE[value & 0x3F];
    } while (value >>= 4);
    return retValue;
}

export function upChange(select, time) {
    this.timer && clearTimeout(this.timer);
    this.timer = setTimeout(() => {
        this.props.change && this.props.change(select);
        delete this.timer;
    }, time < 16.7 ? 16.7 : time)
}
export function safeDECURI(str) {
    try {
        return dec_URI(str);
    } catch (e) {
        return str;
    }
}
export const browser = isBrowser;
export function noop() {}
export function stop(ev) {ev.stopPropagation()}
export const enc_URI = encodeURIComponent || noop;
export const dec_URI = decodeURIComponent || noop;
export const doc = document || {};
export function addEventListener(el, name, callback, is) {
    el instanceof Element && el.addEventListener(name, callback, !!is);
}
export function removeEventListener(el, name, callback) {
    el instanceof Element && el.removeEventListener(name, callback);
}
/****************/
let urlParsingNode,
    originUrl = urlResolve(window.location.href);
export function urlResolve(url) {
    var href = url;
    if (urlParsingNode == null) urlParsingNode = createSimpleEl('a');
    if (document.documentMode) {
        urlParsingNode.setAttribute("href", href);
        href = urlParsingNode.href;
    }
    urlParsingNode.setAttribute('href', href);
    return {
        href: urlParsingNode.href,
        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
        host: urlParsingNode.host,
        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
        hostname: urlParsingNode.hostname,
        port: urlParsingNode.port,
        pathname: (urlParsingNode.pathname[0] === '/') ? urlParsingNode.pathname : '/' + urlParsingNode.pathname
    };
}
export function urlIsSameOrigin(requestUrl) {
    var parsed = (isString(requestUrl)) ? urlResolve(requestUrl) : requestUrl;
    return (parsed.protocol === originUrl.protocol && parsed.host === originUrl.host);
}

/*******************/
let body = doc.body;
export const $body = {
    addClass: function () {
        toggleClass(body, sliceArgs(arguments).join(' '), true);
        return this;
    },
    removeClass: function () {
        toggleClass(body, sliceArgs(arguments).join(' '));
        return this;
    },
    enableClass: function (shouldEnableClass) {
        return this[shouldEnableClass ? 'addClass' : 'removeClass']
            .apply(this, sliceArgs(arguments, 1));
    },
    append: function (ele) {
        body.appendChild(ele.length ? ele[0] : ele);
        return this;
    },
    remove: function (ele) {
        body.removeChild(ele.length ? ele[0] : ele);
        return this;
    },
    locked: function (remove) {
        return this.enableClass(!remove, 'drop-open')
    },
    _body: body
};
export function createSimpleEl(tagName, attrMap) {
    var element = doc.createElement(tagName);
    forEach(attrMap, function (attrVal, attrKey) {
        element[attrKey] = attrVal;
    });
    return element;
}