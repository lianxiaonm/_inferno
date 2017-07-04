/**
 * author: mimi
 * 首页
 */
//公共模块
import Inferno from 'inferno';
import Component from 'inferno-component';

import Page from '../../plugin/common/component/page'
import SwipeMenu from '../../plugin/common/component/swipe-menu'
import { $loading } from '../../plugin/common/service/ionic-lite'
import $log from '../../plugin/common/service/log'


import '../style/less/index.less'
/*
 * 组件定义, 通过继承Component实现
 * */
export default class scrollPage extends Component {
    constructor(props) {
        super(props);
        this.insetList = this.insetList.bind(this);
        this.pullDown = this.pullDown.bind(this);
        this.pullUp = this.pullUp.bind(this);
        this.count = 0;
        this.state = {
            option: {title: {value: '上拉加载+下拉刷新'}},
            list: this.insetList([])
        }
    }

    insetList(list) {
        for (var i = 0; i < 150; i++) {
            list.push({
                txt: 'item---------------' + this.count++,
                btnList: [
                    {html: '编辑', tapClick: ()=>$loading('编辑', 2000), className: 'red'},
                    {html: '删除', tapClick: ()=>$loading('删除', 2000)}
                ]
            });
        }
        return list;
    }

    pullDown(that) {
        setTimeout(()=> {
            this.setState({
                list: this.insetList([])
            });
            that.resetPosition(400);
        }, 2000);
    }

    pullUp(that) {
        setTimeout(()=> {
            this.setState({
                list: this.insetList(this.state.list)
            });
            that.refresh();
        }, 2000);
    }

    componentDidMount() {
    }

    render() {
        const {state} = this;
        let list = state.list;
        return (
            <Page option={state.option}
                  pullDown={this.pullDown}
                  pullUp={this.pullUp}>
                <ul className="item-view">
                    {
                        list.map(item=> <SwipeMenu
                            className="item-list"
                            btnList={item.btnList}>
                            {item.txt}</SwipeMenu>)
                    }
                </ul>
            </Page>
        )
    }
}
