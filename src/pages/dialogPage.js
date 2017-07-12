//公共模块
import Inferno from 'inferno';
import Component from 'inferno-component';

import Page from '../../plugin/common/component/page'

import { $popUp, $sheet } from '../../plugin/common/service/ionic-lite'
import $log from '../../plugin/common/service/log'

import { modelShareBox } from '../../plugin/common/component/shareBox'

import '../style/less/index.less'
/*
 * 组件定义, 通过继承Component实现
 * */
export default class dialogPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            option: {title: {value: 'dialog弹框'}},
            btnList: [
                {text: 'alert', click: this.alert.bind(this, false)},
                {text: 'alert不带标题', click: this.alert.bind(this, true)},
                {text: 'confirm', click: this.confirm.bind(this, false)},
                {text: 'confirm不带标题', click: this.confirm.bind(this, true)},
                {text: 'actionSheet1', click: $sheet.bind(null, ['拍照或录像', '选取现有的'], $log.debug)},
                {text: 'actionSheet2', click: $sheet.bind(null, ['回复', '转发', '打印'], $log.debug)},
                {
                    text: 'shareBox', click: modelShareBox.bind(null, {
                    text: '测试的title'
                })
                },
                {
                    text: 'shareBox1', click: modelShareBox.bind(null,{})
                }
            ]
        }
    }

    alert(noTitle) {
        $popUp.alert({
            title: noTitle ? '' : 'alert',
            content: '删除消息成功',
            tap: $log.debug
        })
    }

    confirm(noTitle) {
        $popUp.confirm({
            title: noTitle ? '' : 'confirm',
            content: '确认要删除当前消息?',
            tap: $log.debug
        })
    }

    actionSheet(btnList) {
        $sheet(btnList, $log.debug);
    }

    shareBox() {

    }

    render() {
        const {state} = this;
        let btnList = state.btnList || [];
        return (
            <Page option={state.option}>
                {
                    btnList.map(item => <button onTap={item.click}>{item.text}</button>)
                }
            </Page>
        )
    }
}
