/**
 * Created by h5 on 2017/5/24.
 */
import Inferno from 'inferno'
import Component from 'inferno-component'

import { stop, extend, equals, buildUrl } from '../service/common'
import { model } from '../service/ionic-lite'

import '../less/shareBox.less'


export default class ShareBox extends Component {

    constructor(props) {
        super(props);
        this.initState = this.initState.bind(this);
        this.close = model.hide.bind(model, stop);
        this.state = this.initState(props);
    }

    initState(props) {
        let baseUrl = 'ewap://1qianbao/share',
            options = extend({
                wx_url: "微信分享跳转URL",
                wx_title: "微信分享标题",
                wx_desc: "微信分享内容",
                wx_icon: "",
                wx_pyq_url: "朋友圈分享跳转URL",
                wx_pyq_title: "朋友圈分享标题",
                wb_content: "微博分享内容（限140字）",
                wb_img: "",
                qzone_title: "QQ空间title",
                qzone_url: "QQ分享跳转链接",
                qzone_summary: "分享的摘要",
                qzone_img: "",
                redirect_url: "" //分享成功后跳转url
            }, props.options || {});
        return {
            screen: options.screen,
            text: options.text,
            shareList: [
                {
                    className: 'icon-friends', text: '朋友圈',
                    url: buildUrl(baseUrl, {
                        to: 0,
                        wx_url: options.wx_pyq_url,
                        wx_title: options.wx_pyq_title,
                        wx_desc: options.wx_desc,
                        wx_icon: options.wx_icon,
                        redirect_url: options.redirect_url
                    })
                },
                {
                    className: 'icon-weChat', text: '微信好友',
                    url: buildUrl(baseUrl, {
                        to: 1,
                        wx_url: options.wx_url,
                        wx_title: options.wx_title,
                        wx_desc: options.wx_desc,
                        wx_icon: options.wx_icon,
                        redirect_url: options.redirect_url
                    })
                },
                {
                    className: 'icon-weiBo', text: '新浪微博',
                    url: buildUrl(baseUrl, {
                        to: 2,
                        wb_content: options.wb_content,
                        wb_img: options.wb_img,
                        redirect_url: options.redirect_url
                    })
                },
                {
                    className: 'icon-qZone', text: 'QQ空间',
                    url: buildUrl(baseUrl, {
                        to: 3,
                        qzone_title: options.qzone_title,
                        qzone_url: options.qzone_url,
                        qzone_summary: options.qzone_summary,
                        qzone_img: options.qzone_img,
                        redirect_url: options.redirect_url
                    })
                }
            ]
        };
    }

    componentWillReceiveProps(nextProps) {
        this._render = !equals(nextProps, this.props);
        this._render && this.setStateSync(this.initState(nextProps));
    }

    shouldComponentUpdate(nextProps) {
        return this._render;
    }


    tapClick(item, event) {
        location.href = item.url;
        model.hide(stop, event);
    }

    render(props, state) {
        let className = ['share-box'];
        state.screen && className.push(state.screen);
        return (
            <div className={className.join(' ')}>
                <div className="share-banner"/>
                <p className="share-text">{state.text || '壹钱包，为每一分钱创造价值'}</p>
                <ul className="m-row share-icon">
                    {
                        state.shareList.map(item => {
                            let tap = this.tapClick.bind(this, item),
                                className = ['col-3'].concat(item.className);
                            return <li className={className.join(' ')} onTap={tap}>{item.text}</li>
                        })
                    }
                </ul>
                <button onTap={this.close}>取消</button>
            </div>
        )
    }

}
export function modelShareBox(options, otherOpt) {
    model(<ShareBox options={options}/>)
}
