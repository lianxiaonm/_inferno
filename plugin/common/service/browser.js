/*
 *code from angular 1.3x
 */

import { isUndefined, isString } from 'inferno-shared'
import { sliceArgs, noop, doc, enc_URI, safeDECURI } from './common';
import $log from './log';

let lastCookies = {},
    lastCookieString = '';
export function $cookies(name, value) {
    var cookieArray, cookie, i, ii, index;
    if (name) {
        if (isUndefined(value)) {
            doc.cookie = enc_URI(name) + "=;path=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        } else if (isString(value)) {
            doc.cookie = enc_URI(name) + '=' + enc_URI(value) + ';path=';
            doc.cookie.length >= 4096 && $log.warn("Cookie '" + name + "' possibly not set or overflowed");
        }
    } else {
        if (doc.cookie !== lastCookieString) {
            lastCookieString = doc.cookie;
            cookieArray = lastCookieString.split("; ");
            lastCookies = {};
            for (i = 0, ii = cookieArray.length; i < ii; i++) {
                index = (cookie = cookieArray[i]).indexOf('=');
                if (index > 0) {
                    name = safeDECURI(cookie.substring(0, index));
                    if (isUndefined(lastCookies[name])) {
                        lastCookies[name] = safeDECURI(cookie.substring(index + 1));
                    }
                }
            }
        }
        return lastCookies;
    }
}

let pendingDeferIds = {},
    outstandingRequestCount = 0,
    outstandingRequestCallbacks = [];
function completeOutstandingRequest(fn) {
    try {
        fn.apply(null, sliceArgs(arguments, 1));
    } finally {
        if (--outstandingRequestCount === 0) {
            while (outstandingRequestCallbacks.length) {
                try {
                    outstandingRequestCallbacks.pop()();
                } catch (e) {
                    $log.error(e);
                }
            }
        }
    }
}
export function browserDefer(fn, delay) {
    var timeoutId;
    outstandingRequestCount++;
    timeoutId = setTimeout(function () {
        delete pendingDeferIds[timeoutId];
        completeOutstandingRequest(fn);
    }, delay || 0);
    pendingDeferIds[timeoutId] = true;
    return timeoutId;
};
browserDefer.cancel = function (deferId) {
    if (pendingDeferIds[deferId]) {
        delete pendingDeferIds[deferId];
        clearTimeout(deferId);
        completeOutstandingRequest(noop);
        return true;
    }
    return false;
};