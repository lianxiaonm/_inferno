/**
 * @author nimin
 */
import { uuid, forEach, lowercase } from '../service/common'
import $q from '../service/$q'
import injectNative from './injectNative'

let devInfo, fingerKeys = {
    language: "language",
    navigator_platform: 'os_name',
    touch_support: 'support_touchscreen',
    resolution: 'resolution',
    user_agent: 'user_agent',
    color_depth: 'color_depth',
    pixel_ratio: 'pixel_ratio',
    available_resolution: 'available_resolution',
    session_storage: 'session_storage',
    local_storage: 'local_storage',
    indexed_db: 'indexed_db',
    open_database: 'open_database'
};

export default function () {
    var defer = $q.defer();
    devInfo ? defer.resolve(devInfo) : injectNative('getDeviceInfo', '', 'JsonString')
        .then(function (val) {
            val.accessmode = 'yqbapp' + lowercase(val.os_name);
            defer.resolve(devInfo = val);
        }, function () {
            require.ensure(['../source/fingerprint2.min'], () => {
                var Fingerprint2 = require('../source/fingerprint2.min');
                new Fingerprint2().get(function (result, components) {
                    devInfo = {token_no: result};
                    forEach(components, function (val) {
                        var key = val.key, value = val.value;
                        if (key === 'user_agent') {
                            devInfo.accessmode = /MicroMessenger/i.test(value) ? 'wechat' :
                                /WeiBo/i.test(value) ? 'xlwb0001' :
                                    /qq/i.test(value) ? 'qqkj0001' : 'browser0001';
                        } else {
                            value = key === 'resolution' ? value.join(':') :
                                key === 'touch_support' ? value[2] : value;
                        }
                        if (fingerKeys.hasOwnProperty(key))
                            devInfo[fingerKeys[key]] = value;
                    });
                    window.localStorage && (function (localStorage) {
                        var uid = localStorage.getItem('$$uid$$');
                        uid || localStorage.setItem('$$uid$$', uid = uuid());
                        devInfo['tme_id'] = uid;
                    })(window.localStorage);
                    defer.resolve(devInfo);
                });
            });
        });
    return defer.promise;
}