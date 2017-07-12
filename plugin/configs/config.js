import { extend } from '../common/service/common'

let win = window || {};

export const remoteApi = win.remoteApi || {
        mtpApiRoot: "http://127.0.0.1:30001",
        dRoot_https: "https://localhost:20003",
        h5Root_https: "http://localhost:20003"
    };

export const appConfig = {
    debugModel: !!win.debugModel || false,
    version: win.appVersion || '1.0.0',
    appName: win.appName || 'h5_inferno',
    getRequestData: function (data, extraData, extraData1) {
        return extend({
            appId: "T-100019",
            clientId: "CMA_CLIENT_ID"
        }, data, extraData, extraData1);
    }
}