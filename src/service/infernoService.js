import BaseHttpRequest from '../../plugin/common/util/httpRequest'
import { inherit, extend } from '../../plugin/common/service/common'

function Child() {
    BaseHttpRequest.call(this);
    this.logAPIUniqueKey = "[AutoTransferService]";
}
inherit(Child, BaseHttpRequest);
// Expose service request apis to consumer.
extend(Child.prototype, {
    getBaiduHtml: function () {
        var reqData = this.getRequestData({
            appId: "100001"//应用程序编号
        });
        return this.getRequest('http://localhost:20003/index.html', reqData);
    },
    search: function (query) {
        return this.jsonpRequest('https://suggest.taobao.com/sug?callback=JSON_CALLBACK', {
            area: 'b2c', code: 'utf-8', k: 1, src: 'tmall_h5', q: query
        });
    },
    searchJd: function (query) {
        return this.postRequest('https://so.m.jd.com/ware/tip.action', {
            keyword: query, _format: 'json'
        })
    },
    loadItem: function (page) {
        return this.jsonpRequest('https://ju.taobao.com/json/tg/ajaxGetItemsV2.json?callback=JSON_CALLBACK', {
            page: page, psize: 50, type: 0, frontCatId: null
        })
    },
    tbKill: function (time) {
        return this.jsonpRequest('https://api.m.taobao.com/h5/mtop.msp.qianggou.queryitembybatchid/3.2/?callback=JSON_CALLBACK', {
            api: 'mtop.msp.qianggou.queryItemByBatchId',
            appKey: '12574478',
            t: new Date().getTime(),
            v: '3.2',
            type: 'json',
            sign: 'ae798bfceac28351b717f0131d989d7a',
            data: encodeURIComponent(JSON.stringify({batchId: time}))
        })
    }
});
export default new Child();