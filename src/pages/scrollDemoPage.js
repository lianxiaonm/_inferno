/**
 * author: mimi
 * 首页
 */
//公共模块
import Inferno from 'inferno';
import Component from 'inferno-component';

import Page from '../../plugin/common/component/page'
import $q from '../../plugin/common/service/$q'

import infernoService from '../service/infernoService'

import JHSCard from '../component/jhsCard'

import '../style/less/index.less'
/*
 * 组件定义, 通过继承Component实现
 * */
export default class scrollDemoPage extends Component {
    constructor(props) {
        super(props);
        this.loadList = this.loadList.bind(this);
        this.pullDown = this.pullDown.bind(this);
        this.pullUp = this.pullUp.bind(this);
        this._page = 0;
        this.state = {
            option: {
                title: {value: '仿聚划算列表'}
            },
            list: []
        }
        this.loadList(1);
    }

    loadList(page) {
        return page != this._page ? infernoService.loadItem(page)
            .then(res => {
                let list = page == 1 ? [] : this.state.list;
                this._page = page;
                this.setState({list: list.concat(res.data.itemList || [])});
            }) : $q.when();
    }

    pullDown(that) {
        this._page = 0;
        this.loadList(1).then(() => {
            that.resetPosition(400);
        });
    }

    pullUp(that) {
        this.loadList(this._page + 1).then(() => {
            that.refresh();
        });
    }

    render() {
        const {state} = this;
        let list = state.list;
        return (
            <Page option={state.option}
                  pullUp={this.pullUp}>
                <ul className="item-view jhs-card-list">
                    {
                        list.map(item => <JHSCard data={item}/>)
                    }
                </ul>
            </Page>
        )
    }
}

