import { isFunction, isString, isArray, isBrowser } from 'inferno-shared'
import { noop, fromJson } from '../service/common'
import $q from '../service/$q'

//
let android = /1qianbao-android-(\d+)(\.\d+)+/,
    ios = /1qianbao-ios-(\d+)(\.\d+)+/,
    nativeMs = {
        getDeviceInfo: '4.0',       //获取deviceId
        getNavigationConfig: '4.0', //壹钱包头配置
        getAlbumPhotos: '4.1',      //打开摄像头
        getPhotograph: '4.1',       //打开相册
        getImageResources: '4.1',   //获取照片资源
        openCMSForWardUrl: '4.2',   //打开CMS
        getSharePlugin: '4.3',      //打开分享
        setInternalCookie: '4.3.1', //注入内部登录太
        getWLTToken: '4.3.1',       //获取万里通登录态
        isUserLogin: "4.4.0"        //用户是否登录
    },
    defers = {},
    userAgent = window.navigator.userAgent,
    version;
const yqbNative = window.yqbNative = {
    android: android, ios: ios,
    getDefer: function (key) {
        return defers[key];
    },
    delDefer: function (key) {
        return delete defers[key];
    },
    getSystem: function () {
        return /android/i.test(userAgent) ? 'android'
            : /ios/i.test(userAgent) ? 'IOS' : '';
    },
    getAppVersion: function () {
        if (version) return version;
        let appPlat = this.getSystem(),
            exp1 = /1qianbao-android-/,
            exp2 = /1qianbao-ios-/,
            match = userAgent.match(appPlat == 'IOS' ? ios : android);
        version = match && match[0].replace(appPlat == 'IOS' ? exp2 : exp1, '') || '';
        version || (function (yqb) {
            if (isFunction(yqb.getAppVersion)) {
                var appVer = yqb.getAppVersion() || '',
                    verArray = isString(appVer) ? appVer.split('_') : [];
                version = verArray[1] || verArray[0] || '';
            }
        })(window.YiQianBao || {});
        return version;
    },
    setAppVersion: function (ver) {
        version = ver;
    },
    addUpdateMethod: function (name, lowVersion) {
        nativeMs[name] = lowVersion || '0.0.0';
    },
    compareVer: function (ver) {
        let vs = this.getAppVersion().split('.'),
            rvs = (ver || '').split('.'),
            vs1 = ~~vs[0], vs2 = ~~vs[1], vs3 = ~~vs[2],
            rvs1 = ~~rvs[0], rvs2 = ~~rvs[1], rvs3 = ~~rvs[2];
        return ver && vs1 > rvs1 || (vs1 == rvs1 && vs2 > rvs2) ||
            (vs1 == rvs1 && vs2 == rvs2 && vs3 >= rvs3);
    },
    nativeCall: function (key, type, retain) {
        var defer = this.getDefer(key) || undefined;
        if (retain) {
            var pending = defer && defer.promise && defer.promise.$$state && defer.promise.$$state.pending || [],
                resolve = (pending[0] || [])[1] || noop,
                reject = (pending[0] || [])[2] || noop;
            type != 'fail' ? resolve(type) : reject(type);
        } else {
            defer && defer[type != 'fail' ? 'resolve' : 'reject'](type);
            this.delDefer(key);
        }
    },
    callString: function (key, type, retain) {
        key = key === undefined ? $id : key;
        return 'window.yabNative.nativeCall("' + key + '","' + (type || 'success') + '"' + (retain ? ',true' : '') + ')';
    }
};
let $id = 0, queue = [], injectFlag, timeOut = 5 * 1000, undefined = undefined, t = 0,
    universalJsFun = window.YiQianBao && window.YiQianBao.UniversalJSFunction;

function invoke(name, args) {
    if (yqbNative.compareVer(nativeMs[name]) && universalJsFun) {
        isArray(args) ? args.unshift(name) : args = args ? [name, args] : [name];
        return universalJsFun.apply(this, args);
    }
}

function dispatch(name, args, type, id) {
    var defer = defers[id], result;
    if (!isFunction(universalJsFun)) {
        defer.reject('native JS注入错误');
        delete defers[id];
    } else {
        result = invoke(name, args);
        if (type || result == null || result == '') defer.reject('');
        else defer.resolve('JsonString' == type ? fromJson(result) : result);
    }
}
export default function (name, argsList, type, only) {
    only && yqbNative.delDefer(name);
    var id = only ? name : $id++,
        defer = defers[id] = $q.defer();
    if (!isBrowser || !yqbNative.compareVer(nativeMs[name])) {
        delete defers[id];
        defer.reject('js 方法不存在或版本不支持');
    } else if (!universalJsFun && t <= timeOut) {
        queue.push({name: name, arg: argsList || [], type: type, id: id});
        injectFlag || (function inject() {
            universalJsFun = window.YiQianBao && window.YiQianBao.UniversalJSFunction;
            if ((t += 100) > timeOut || universalJsFun) {
                while (queue.length) {
                    let cache = queue.shift();
                    dispatch(cache.name, cache.arg, cache.type, cache.id);
                }
            } else inject();
        })();
    } else dispatch(name, argsList || [], type, id);
    return defer.promise;
}