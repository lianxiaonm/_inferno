/**
 * Created by h5 on 2017/7/4.
 */
import Inferno from 'inferno'
import Component from 'inferno-component'

import Page from '../../plugin/common/component/page'
import Rate from '../../plugin/common/component/rate'

import $log from '../../plugin/common/service/log'


import '../style/less/index.less'

export default class ratePage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            option: {
                title: {value: 'rate page'}
            }
        }
    }

    render() {
        const {state} = this;
        return (
            <Page option={state.option}>
                <h3>常规(默认长度5)</h3>
                <Rate value="2" select={$log.debug}/>
                <h3>自定义长度</h3>
                <Rate max="20" value="3.5" select={$log.debug}/>
                <h3>展示型</h3>
                <Rate max="10" value="7.8" disbaled={true}/>
            </Page>
        )
    }
}