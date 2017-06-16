//公共模块
import Inferno from 'inferno';
import Component from 'inferno-component';

import Page from '../../plugin/common/component/page'

import '../style/less/index.less'
/*
 * 组件定义, 通过继承Component实现
 * */
class loadingPage extends Component {
    constructor(props) {
        super(props);
        this.state.option = {
            title: {value: 'native交互'}
        }
    }

    render(prop, state) {
        let btnList = [
            'getDeviceInfo'
        ];
        return (
            <Page option={state.option}>
                {
                    btnList.map(item=><button >{item}</button>)
                }
            </Page>
        )
    }
}

export default loadingPage
