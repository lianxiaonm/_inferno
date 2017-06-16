import { isObject, isFunction } from 'inferno-shared'
import {
    lowercase, uppercase, forEach,
    bind, buildUrl, extend,
    hash, toJson, isDefined,
    noop, fromJson
} from '../service/common'
import $q from '../service/$q'
import $log from '../service/log'
import $http from '../service/http'
import finger from './FW.finger'
import utility from './FW.utility'
import { $loading } from '../service/ionic-lite'

//业务层面的模块
import { appConfig, remoteApi } from '../../configs/config'


// api base url
let apiBaseUrl = remoteApi.apiBaseUrl || remoteApi.psptApiRoot || '',
    mtpApiRoot = remoteApi.mtpApiRoot,
    deviceInfo, queueList = [], hasReady = 0;

function getRequestUrl(url) {
    return /^(ftp:\/\/|http:\/\/|https:\/\/|\/\/)[^ "]+$/.test(url) ? url : apiBaseUrl + url;
}

function isHttpRespDataConverter(result) {
    return !(result && isDefined(result.code) && isDefined(result.message) && isDefined(result.data));
}

const promise = {
    success: function (defered, dto, requestData, urlHash, method, resp) {
        var result = isHttpRespDataConverter(resp.data) ?
            utility.httpRespDataConverter(resp.data, resp.status) : resp.data;
        if (dto && isFunction(dto)) result = dto.call(this, result, requestData);
        urlHash && localStorage.setItem(urlHash, toJson(result));
        /post/i.test(method) && $loading.hide();
        defered.resolve(result);
    },
    failed: function (defered, method, resp) {
        var result = isHttpRespDataConverter(resp.data) ?
            utility.httpRespDataConverter(resp.data || {}, resp.status) : resp.data;
        result.message ? $loading(result.message, 3000) : /post/i.test(method) && $loading.hide();
        defered.reject(result);
    }
};

function BaseHttpRequest() {
    this.httpRequestDefaultConfig = {withCredentials: true};
    this.getRequestData = appConfig.getRequestData;
    this.logKey = function () {
        return this.logAPIUniqueKey || "Not Defined Log Key!";
    };
    function registerMultipleMethods(methods) {
        var self = this;
        self._getDTO = function (config) {
            var dto = config.dto || null;
            return delete config.dto, dto;
        };
        function defRequest(defered, method, url, requestData, config, urlHash) {
            method = method && method.toLowerCase() || "get";
            config = isFunction(config) ? {dto: config} : config || {};
            requestData = isObject(requestData) ? requestData : {};
            var dto = this._getDTO(config), _reqData = {};
            // 当请求后台服务接口设置：withCredentials = true
            config = extend({}, this.httpRequestDefaultConfig, config);
            if (isObject(deviceInfo) && url.indexOf(mtpApiRoot) !== -1) {
                config = extend(config, {
                    headers: {
                        devInfo: encodeURIComponent(toJson(deviceInfo))
                    }
                });
                _reqData = appConfig.getRequestData(_reqData);
                if (_reqData.clientId == requestData.clientId
                    || null == requestData.clientId) //业务层面没有传递clientId
                    requestData = extend({}, requestData, {
                        clientId: deviceInfo['token_no']
                    })
            }
            let successFn = bind(this, promise.success, defered, dto, requestData, urlHash, method),
                errorFn = bind(this, promise.failed, defered, method);
            if (/(get|jsonp)/i.test(method)) {
                $http[method](buildUrl(url, requestData), config).then(successFn, errorFn);
            } else if (/post/i.test(method)) {
                $loading('crescent'), $http.post(url, requestData, config).then(successFn, errorFn);
            }
            return defered;
        }

        function doRequest(method, url, requestData, config, cache) {
            cache = cache && !!localStorage;
            var defer = $q.defer(), self = this, cacheResp,
                urlHash = cache && hash(location.href + '@@@' + url);
            cache && (cacheResp = localStorage.getItem(urlHash)) && (function () {
                var pending = defer.promise.$$state && defer.promise.$$state.pending || [];
                ((pending[0] || [])[1] || noop)(extend(fromJson(cacheResp), {fromCache: true}));
            })();
            var configList = [defer, method, url, requestData, config, cache && urlHash];
            return !deviceInfo && url.indexOf(mtpApiRoot) !== -1 ?
                (function () {
                    queueList.push(configList);
                    hasReady++ || finger().then(function (val) {
                        deviceInfo = val;
                        forEach(queueList, function (queue) {
                            defRequest.apply(self, queue);
                        }), queueList = [];
                    }, function () {
                        deviceInfo = {token_no: 'unknown device'};
                    });
                    return defer.promise;
                })() : defRequest.apply(self, configList).promise;
        }

        forEach(methods, function (val) {
            var method = lowercase(val), UpMethod = uppercase(val);
            self[method + 'Request'] = function (url, reqData, config, cache) {
                return doRequest.call(this, UpMethod, getRequestUrl(url), reqData, config, cache);
            }
        });
    }

    registerMultipleMethods.call(BaseHttpRequest.prototype, ['GET', 'JSONP', 'POST']);
}

export default BaseHttpRequest;


