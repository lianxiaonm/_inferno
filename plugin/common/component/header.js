import Inferno from 'inferno';
import Component from 'inferno-component';

import { forEach, toJson, equals, extend, valueFn, browser } from '../service/common'

let defaultOption = {
    title: {
        type: "TitleNormal", value: document.title,
        onOpenHandler: valueFn(true),
        onCloseHandler: valueFn(true)
    }, right: [], left: {
        goBackHandler: function () {
            history.back();
        }, isShow: true, hideClose: false
    }, dropToRefresh: {},
    mandatoryUseH5Header: false, hideH5Header: false
};

function updateOption(option) {
    option = extend({}, defaultOption, option || {});
    // 配置左侧按钮
    var left = option.left;
    if (left.isShow === false || left.isShow === 'hide') {
        left.show = left.closeShow = !1, left.isShow = 'hide';
    } else {
        left.show = !0, left.isShow = 'show';
        left.close = !left.hideClose && browser && appVer;
    }
    // 配置中间 title 部分
    document.title = option.title.value;
    //配置右侧按钮
    var rights = option.right.slice(0, 2);
    option.right = rights.map(function (rb) {
        if (rb.type == 'OnlyImage') {
            rb.isOnlyImage = true;
            rb.imageURL && (rb.bgStyleTmpl = 'background-image:url(\"' + rb.imageURL + '\");');
        } else if (rb.type == "OnlyTitle") {
            rb.isOnlyTitle = true;
        } else rb.isOnlyImage = true;
        if (typeof rb.onClickHandler !== 'function')
            rb.onClickHandler = valueFn(true);
        return rb;
    });
    option.dropToRefresh.dropToRefresh = 'disable';
    return option;
}
function closeWebView() {
}

let appVer = false, support = false;

export default class Header extends Component {
    constructor(props) {
        super(props);
        this.tapClick = this.tapClick.bind(this);
        this.goBackHandler = this.goBackHandler.bind(this);
        this.injectNative = this.injectNative.bind(this);
        this.injectNative(props);
    }

    tapClick() {
        var titleOp = this.state.option.title;
        if (titleOp.type == "TitleWithTab") {
            titleOp.onOpenHandler() && this.setState({
                tabState: this.state.tabState == 'close' ? 'open' : 'close'
            });
        }
    }

    goBackHandler(event) {
        let left = this.state.option.left;
        left.close = !left.hideClose && appVer || !1;
        left.show ? left.goBackHandler(event) : closeWebView();
    }

    injectNative(props) {
        let option = updateOption(props.option || {}),
            tabState = option.title.type == "TitleWithTab" ? 'close' : null,
            useH5Header = option.mandatoryUseH5Header || !support,
            self = this;
        self.setState({option: option, tabState: tabState, useH5Header: useH5Header})
    }

    componentWillReceiveProps(nextProps) {
        equals(nextProps, this.props) || this.injectNative(nextProps);
    }

    render() {
        let {state} = this,
            useH5Header = state.useH5Header,
            option = state.option || {},
            left = option.left,
            title = option.title,
            right = option.right,
            tabState = state.tabState || '';
        return useH5Header ? (
            <header className="vx-header">
                <div class="head-left">
                    {left.show ? <i onTap={this.goBackHandler} className="icon-font">&#xe679;</i> : ''}
                    {left.close ? <i onTap={closeWebView} className="icon-font">&#xe646;</i> : ''}
                </div>
                <h3 className={`head-title ${tabState}`}
                    onTap={this.tapClick}>{title.value || '默认标题'}</h3>
                <div className="head-right">
                    {
                        right.map(item => {
                            let text = item.OnlyTitle ? item.textValue : '',
                                clazz = item.isOnlyImage ? 'icon' : '',
                                style = item.bgStyleTmpl || '';
                            return <i onTap={item.onClickHandler} style={style} className={clazz}>{text}</i>;
                        })
                    }
                </div>
            </header>
        ) : ''
    }
}

