import { extend } from '../common/service/common'

let win = window || {};

export const remoteApi = win.remoteApi || {
        mtpApiRoot: "http://127.0.0.1:30001",
        mapOauthRoot: "http://127.0.0.1:30001",
        psptApiRoot: "http://localhost:30001",
        ccdcApiRoot: "http://127.0.0.1:30001",
        dRoot: "http://localhost:20003",
        dRoot_https: "https://localhost:20003",
        msApiRoot: "http://localhost:20003",
        msApiRoot_https: "http://localhost:20003",
        h5Root: "http://localhost:20003",
        h5Root_https: "http://localhost:20003",
        mallRoot: "https://127.0.0.1:20003"
    };

export const appConfig = {
    debugModel: !!win.debugModel || false,
    version: win.appVersion || '1.0.0',
    appName: win.appName || 'h5_angular',
    getRequestData: function (data, extraData, extraData1) {
        return extend({
            appId: "T-100019",
            clientId: "CMA_CLIENT_ID"
        }, data, extraData, extraData1);
    }
}