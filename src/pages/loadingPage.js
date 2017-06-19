//公共模块
import Inferno from 'inferno';
import Component from 'inferno-component';

import Page from '../../plugin/common/component/page'

import { $loading } from '../../plugin/common/service/ionic-lite'

import '../style/less/index.less'
/*
 * 组件定义, 通过继承Component实现
 * */
class loadingPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            option: {title: {value: 'loading'}}
        }
    }

    componentDidMount() {
    }

    loading(type) {
        $loading(type, 3000, () => {
            console.log(type + ' loading close');
        });
    }

    render() {
        const {state} = this;
        let btnList = [
            'ios', 'ios-small', 'bubbles', 'circles', 'crescent', 'dots', 'lines', 'ripple', 'spiral',
            '<i class="icon-font icon-loading1"></i>加载中',
            '<i class="icon-font icon-warn"></i>警告',
            '<i class="icon-font icon-info"></i>提示..',
        ];
        return (
            <Page option={state.option}>
                {
                    btnList.map(item => <button
                        onTap={this.loading.bind(this, item)} dangerouslySetInnerHTML={{__html: item}}></button>)
                }
            </Page>
        )
    }
}

export default loadingPage
