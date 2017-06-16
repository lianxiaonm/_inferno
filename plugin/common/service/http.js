import { isFunction, isUndefined, isObject, isString, isArray } from 'inferno-shared'
import {
    fromJson, lowercase, uppercase,
    trim, forEach, isPromiseLike,
    shallowCopy, extend, urlIsSameOrigin,
    buildUrl, isFile, isBlob, toJson
} from './common';
import $q from './$q';
import { $cookies } from './browser'
import $cacheFactory from './cacheFactory';
import $httpBackend from './httpBackend';


let APPLICATION_JSON = 'application/json',
    CONTENT_TYPE_APPLICATION_JSON = {
        'Content-Type': APPLICATION_JSON + ';charset=utf-8'
    }, undefined;

function defaultHttpResponseTransform(data, headers) {
    if (isString(data)) {
        data = data.replace(/^\)\]\}',?\n/, '');
        var contentType = headers('Content-Type') || '';
        if (contentType.indexOf(APPLICATION_JSON) === 0 ||
            /^\s*(\[|\{[^\{]).*[\}\]]\s*$/.test(data)) {
            data = fromJson(data);
        }
    }
    return data;
}

function parseHeaders(headers) {
    var key, val, i, parsed = {};
    headers && forEach(headers.split('\n'), function (line) {
        i = line.indexOf(':');
        key = lowercase(trim(line.substr(0, i)));
        val = trim(line.substr(i + 1));
        if (key) {
            parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
        }
    });
    return parsed;
}

function headersGetter(headers) {
    var headersObj = isObject(headers) ? headers : undefined;
    return function (name) {
        if (!headersObj) headersObj = parseHeaders(headers);
        return name ? headersObj[lowercase(name)] || null : headersObj;
    };
}

function transformData(data, headers, fns) {
    if (isFunction(fns))
        return fns(data, headers);
    forEach(fns, function (fn) {
        data = fn(data, headers);
    });
    return data;
}

let defaults = {
    transformResponse: [defaultHttpResponseTransform],
    transformRequest: [function (d) {
        return isObject(d) && !isFile(d) && !isBlob(d) ? toJson(d) : d;
    }],
    headers: {
        common: {
            'Accept': 'application/json, text/plain, */*'
        },
        post: shallowCopy(CONTENT_TYPE_APPLICATION_JSON),
        put: shallowCopy(CONTENT_TYPE_APPLICATION_JSON),
        patch: shallowCopy(CONTENT_TYPE_APPLICATION_JSON)
    },
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN'
};

function isSuccess(status) {
    return 200 <= status && status < 300;
}
let defaultCache = $cacheFactory('$http'),
    reversedInterceptors = [];

const $http = function (requestConfig) {
    var headers = mergeHeaders(requestConfig),
        config = extend({
            method: 'get',
            transformRequest: defaults.transformRequest,
            transformResponse: defaults.transformResponse
        }, requestConfig);
    config.headers = headers;
    config.method = uppercase(config.method);

    var serverRequest = function (config) {
        headers = config.headers;
        var reqData = transformData(config.data, headersGetter(headers), config.transformRequest);
        isUndefined(reqData) && forEach(headers, function (value, header) {
            if (lowercase(header) === 'content-type') delete headers[header];
        });
        if (isUndefined(config.withCredentials) && !isUndefined(defaults.withCredentials))
            config.withCredentials = defaults.withCredentials;
        // send request
        return sendReq(config, reqData, headers).then(transformResponse, transformResponse);
    };

    var chain = [serverRequest, undefined],
        promise = $q.when(config);
    // apply interceptors
    forEach(reversedInterceptors, function (interceptor) {
        if (interceptor.request || interceptor.requestError)
            chain.unshift(interceptor.request, interceptor.requestError);
        if (interceptor.response || interceptor.responseError)
            chain.push(interceptor.response, interceptor.responseError);
    });
    while (chain.length) {
        var thenFn = chain.shift(),
            rejectFn = chain.shift();
        promise = promise.then(thenFn, rejectFn);
    }
    promise.success = function (fn) {
        promise.then(function (response) {
            fn(response.data, response.status, response.headers, config);
        });
        return promise;
    };
    promise.error = function (fn) {
        promise.then(null, function (response) {
            fn(response.data, response.status, response.headers, config);
        });
        return promise;
    };
    return promise;

    function transformResponse(response) {
        var resp = extend({}, response);
        resp.data = response.data && transformData(response.data, response.headers, config.transformResponse);
        return isSuccess(response.status) ? resp : $q.reject(resp);
    }

    function mergeHeaders(config) {
        var defHeaders = defaults.headers,
            reqHeaders = extend({}, config.headers),
            defHeaderName, lowercaseDefHeaderName, reqHeaderName;
        defHeaders = extend({}, defHeaders.common, defHeaders[lowercase(config.method)]);
        defaultHeadersIteration:
            for (defHeaderName in defHeaders) {
                lowercaseDefHeaderName = lowercase(defHeaderName);
                for (reqHeaderName in reqHeaders) {
                    if (lowercase(reqHeaderName) === lowercaseDefHeaderName) {
                        continue defaultHeadersIteration;
                    }
                }
                reqHeaders[defHeaderName] = defHeaders[defHeaderName];
            }
        // execute if header value is a function for merged headers
        forEach(reqHeaders, function (headerFn, header) {
            if (isFunction(headerFn)) {
                var headerContent = headerFn();
                headerContent != null ? headers[header] = headerContent
                    : delete headers[header];
            }
        });
        return reqHeaders;
    }
}

$http.pendingRequests = [];
createShortMethods('get', 'delete', 'head', 'jsonp');
createShortMethodsWithData('post', 'put', 'patch');
$http.defaults = defaults;

export default $http;

function createShortMethods(names) {
    forEach(arguments, function (name) {
        $http[name] = function (url, config) {
            return $http(extend(config || {}, {
                method: name,
                url: url
            }));
        };
    });
}

function createShortMethodsWithData(name) {
    forEach(arguments, function (name) {
        $http[name] = function (url, data, config) {
            return $http(extend(config || {}, {
                method: name,
                url: url,
                data: data
            }));
        };
    });
}

function sendReq(config, reqData, reqHeaders) {
    var deferred = $q.defer(),//
        promise = deferred.promise,
        cache, cachedResp,
        url = buildUrl(config.url, config.params);
    $http.pendingRequests.push(config);
    promise.then(removePendingReq, removePendingReq);
    if ((config.cache || defaults.cache) && config.cache !== false &&
        (config.method === 'GET' || config.method === 'JSONP')) {
        cache = isObject(config.cache) ? config.cache :
            isObject(defaults.cache) ? defaults.cache :
                defaultCache;
    }
    if (cache) {
        cachedResp = cache.get(url);
        if (isUndefined(cachedResp)) {
            cache.put(url, promise);
        } else if (isPromiseLike(cachedResp)) {
            cachedResp.then(removePendingReq, removePendingReq);
            return cachedResp;
        } else {
            isArray(cachedResp) ?
                resolvePromise(cachedResp[1], cachedResp[0], shallowCopy(cachedResp[2]), cachedResp[3]) :
                resolvePromise(cachedResp, 200, {}, 'OK');
        }
    }
    if (isUndefined(cachedResp)) {
        var xsrfValue = urlIsSameOrigin(config.url) ?
            $cookies()[config.xsrfCookieName || defaults.xsrfCookieName] : undefined;
        if (xsrfValue)
            reqHeaders[(config.xsrfHeaderName || defaults.xsrfHeaderName)] = xsrfValue;
        $httpBackend(config.method, url, reqData, done, reqHeaders, config.timeout,
            config.withCredentials, config.responseType);
    }
    return promise;
    function done(status, response, headersString, statusText) {
        cache ? !isSuccess(status) ?
            cache.put(url, [status, response, parseHeaders(headersString), statusText]) :
            cache.remove(url) : '';
        resolvePromise(response, status, headersString, statusText);
    }

    function resolvePromise(response, status, headers, statusText) {
        status = Math.max(status, 0);
        deferred[isSuccess(status) ? 'resolve' : 'reject']({
            data: response,
            status: status,
            headers: headersGetter(headers),
            config: config,
            statusText: statusText
        });
    }

    function removePendingReq() {
        var idx = $http.pendingRequests.indexOf(config);
        idx !== -1 && $http.pendingRequests.splice(idx, 1);
    }
}
