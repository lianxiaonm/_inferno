/**
 * @author nimin
 *
 */
import { isObject } from 'inferno-shared'
import { forEach, toJson } from '../service/common'

export default {
    stringFormat(){
        for (var fmt = arguments[0], ndx = 1; ndx < arguments.length; ++ndx) {
            fmt = fmt.replace(new RegExp('\\{' + (ndx - 1) + '\\}', "g"), toJson(arguments[ndx]));
        }
        return fmt;
    },
    parseParams(str){
        return str.split('&').reduce(function (params, param) {
            var paramSplit = param.split('=').map(function (value) {
                return decodeURIComponent(value.replace('+', ' '));
            });
            params[paramSplit[0]] = paramSplit[1];
            return params;
        }, {});
    },
    // http request success converter.
    httpRespDataConverter(data, status) {
        var code = data.code || data.resultCode || '',
            message = data.message || data.resultMsg || '';
        if (status == 200) {    //此处根据接入后台的返回码来定，，此处调用了
            delete data.resultCode;
            delete data.resultMsg;
        } else {
            code = code || status;
            message = message || "[" + code + " : 服务器未知错误]";
        }
        return {code: code, message: message, data: data};
    },
    tracking(eventId, mapObject) {
        if (Agent && isObject(mapObject)) {
            var map = new hashMap();
            forEach(mapObject, function (value, key) {
                map.put(key, value)
            });
            Agent.customizeEvent(eventId, map);
        } else if (Agent) Agent.clickEvent(eventId);
    },
    getBrowser() {
        var ua = window.navigator.userAgent;
        return {
            isWX: /micromessenger/i.test(ua),
            isQQ: /mqqbrowser|qq/i.test(ua),
            isUC: /ucbrowser/i.test(ua),
            isWeiBo: /weibo/i.test(ua),
            isSafari: /safari/i.test(ua) && !/mqqbrowser/i.test(ua),
            isChrome: /chrome/i.test(ua) && !/mqqbrowser/i.test(ua)
        }
    }
}