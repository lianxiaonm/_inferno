import {
    lowercase, callbacks, isPromiseLike,
    urlResolve, createSimpleEl,
    addEventListener, removeEventListener,
    $body, noop
} from './common';
import { browserDefer } from './browser'


function jsonpReq(url, callbackId, done) {
    var script = createSimpleEl('script', {
        type: 'text/javascript',
        src: url, async: true
    }), callback = function (event) {
        removeEventListener(script, 'load', callback);
        removeEventListener(script, 'error', callback);
        $body.remove(script), script = null;
        let status = -1, text = "unknown";
        if (event) {
            if (event.type === "load" && !callbacks[callbackId].called)
                event = {type: "error"};
            text = event.type;
            status = event.type === "error" ? 404 : 200;
        }
        done && done(status, text);
    }
    addEventListener(script, 'load', callback);
    addEventListener(script, 'error', callback);
    $body.append(script);
    return callback;
}

export default function (method, url, post, callback, headers, timeout, withCredentials, responseType) {
    url = url || window.location.href.replace(/%27/g, "'");
    if (lowercase(method) == 'jsonp') {
        var callbackId = '_' + (callbacks.counter++).toString(36);
        callbacks[callbackId] = function (data) {
            callbacks[callbackId].data = data;
            callbacks[callbackId].called = true;
        };
        var jsonpDone = jsonpReq(url.replace('JSON_CALLBACK', 'Inferno_callbacks.' + callbackId),
            callbackId, function (status, text) {
                completeRequest(callback, status, callbacks[callbackId].data, "", text);
                callbacks[callbackId] = noop;
            });
    } else {
        var xhr = new window.XMLHttpRequest();
        xhr.open(method, url, true);
        for (var name in headers) {
            headers[name] != null && xhr.setRequestHeader(name, headers[name]);
        }
        xhr.onload = function requestLoaded() {
            var statusText = xhr.statusText || '',
                response = 'response' in xhr ? xhr.response : xhr.responseText,
                status = xhr.status === 1223 ? 204 : xhr.status;
            if (status === 0)
                status = response ? 200 : urlResolve(url).protocol == 'file' ? 404 : 0;
            completeRequest(callback, status, response, xhr.getAllResponseHeaders(), statusText);
        };
        xhr.onerror = xhr.onabort = function () {
            completeRequest(callback, -1, null, null, '');
        };
        if (withCredentials) xhr.withCredentials = true;
        if (responseType) {
            try {
                xhr.responseType = responseType;
            } catch (e) {
                if (responseType !== 'json') throw e;
            }
        }
        xhr.send(post || null);
    }
    if (timeout > 0) {
        var timeoutId = browserDefer(timeoutRequest, timeout);
    } else if (isPromiseLike(timeout)) {
        timeout.then(timeoutRequest);
    }
    function timeoutRequest() {
        jsonpDone && jsonpDone();
        xhr && xhr.abort();
    }

    function completeRequest(callback, status, response, headersString, statusText) {
        timeoutId && browserDefer.cancel(timeoutId);
        jsonpDone = xhr = null;
        callback(status, response, headersString, statusText);
    }
}