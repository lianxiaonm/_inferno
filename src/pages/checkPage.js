//公共模块
import Inferno from 'inferno';
import Component from 'inferno-component';

import Page from '../../plugin/common/component/page'
import CheckBox, { dialogCkBox, modelCkBox } from '../../plugin/common/component/checkBox'
import $log from '../../plugin/common/service/log'

import '../style/less/index.less'
/*
 * 组件定义, 通过继承Component实现
 * */
export default class indexPage extends Component {
    constructor(props) {
        super(props);
        let values = [
            {text: '张三', value: ''},
            {text: '李四', value: ''},
            {text: '王五', value: ''},
            {text: '赵六', value: ''},
            {text: '赵六1', value: ''},
            {text: '赵六2', value: ''},
            {text: '赵六3', value: ''}
        ];
        let options = {type: 'multiple', values: values, checkFn: $log.debug},
            options1 = {type: 'single', values: values, checkFn: $log.debug};
        this.tapClick0 = this.tapClick.bind(this, options);
        this.tapClick1 = this.tapClick.bind(this, options1);
        this.modelClick0 = this.modelClick.bind(this, options);
        this.modelClick1 = this.modelClick.bind(this, options1);
        this.check = this.check.bind(this);
        this.state = {
            option: {
                title: {value: 'check page'}
            },
            checkBoxList: [
                {type: 'multiple', values: values, title: '多选'},
                {type: 'multiple', values: values, className: 'lft', title: '多选左'},
                {type: 'multiple', values: values, className: 'v1', title: '多选V1'},
                {type: 'multiple', values: values, className: 'v1 lft', title: '多选V1左'},
                {type: 'single', values: values, title: '单选V1'},
                {type: 'single', values: values, className: 'lft', title: '单选V1左'},
                {type: 'single', values: values, className: 'v1', title: '单选'},
                {type: 'single', values: values, className: 'v1 lft', title: '单选V1左'}
            ],
            checkList: {
                multiple: [0, 1, 2],
                single: [0]
            }
        }
    }

    tapClick(options) {
        dialogCkBox(options);
    }

    modelClick(options) {
        modelCkBox(options);
    }

    check(type, idxMap) {
        let checkList = this.state.checkList;
        checkList[type] = idxMap;
        this.setState({checkList: checkList});
    }

    render() {
        const {state} = this;
        return (
            <Page option={state.option}>
                {
                    state.checkBoxList.map(item =>
                        <div>
                            <h3>{item.title}</h3>
                            <CheckBox
                                type={item.type}
                                values={item.values}
                                checkList={state.checkList[item.type]}
                                checkFn={this.check}
                                className={item.className}/>
                        </div>
                    )
                }
                <h3>dialog式</h3>
                <button onTap={this.tapClick0}>弹出框多选</button>
                <button onTap={this.tapClick1}>弹出框单选</button>
                <h3>model式</h3>
                <button onTap={this.modelClick0}>model多选</button>
                <button onTap={this.modelClick1}>model单选</button>
            </Page>
        )
    }
}
