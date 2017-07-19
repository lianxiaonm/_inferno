/**
 * author: mimi
 * 首页
 */
//公共模块
import Inferno from 'inferno';
import Component from 'inferno-component';

import Page from '../../plugin/common/component/page'
import $log from '../../plugin/common/service/log'


import '../style/less/index.less'
/*
 * 组件定义, 通过继承Component实现
 * */
//connect(['englishStore', 'frenchStore'])
export default class indexPage extends Component {
    constructor(props) {
        super(props);
        this.state.option = {
            title: {value: 'inferno 框架文档'},
            right: [{onClickHandler: $log.debug}]
        }
    }


    render() {
        const {state} = this;
        let docList   = [
            {url: 'icon', text: 'icon图标'},
            {url: 'dialog', text: 'dialog对话框'},
            {url: 'picker', text: 'picker选择器'},
            {url: 'loading', text: 'loading加载'},
            {url: 'payPwd', text: '密码组件+虚拟键盘'},
            {url: 'scroll', text: '下拉刷新+上拉加载'},
            {url: 'slider', text: '轮播(未实现)'},
            {url: 'scroll', text: '滑动菜单(见下拉刷新+上拉加载更多)'},
            {url: 'form', text: 'otp组件(见Form表单)'},
            {url: 'native', text: 'native交互'},
            {url: 'dialog', text: '分享组件(见dialog)'},
            {url: 'form', text: 'Form表单'},
            {url: 'check', text: '单选多选'},
            {url: 'popover', text: 'Popover(未实现)'},
            {url: 'progress', text: '进度条'},
            {url: 'collapse', text: '折叠面板'},
            {url: 'tab', text: 'tabs'},
            {url: 'search', text: '搜索页'},
            {url: 'scrollDemo', text: '仿聚划算'},
            {url: 'rate', text: '评分组件(雏形)'}
        ];
        return (
            <Page option={state.option}>
                <ul className="item-view">
                    {
                        docList.map(item => <li
                            onTap={() => this.context.router.push(item.url)}
                            className="item-list">{item.text}</li>)
                    }
                </ul>
            </Page>
        )
    }
}
