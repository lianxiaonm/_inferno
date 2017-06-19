//公共模块
import Inferno from 'inferno';
import Component from 'inferno-component';
import Page from '../../plugin/common/component/page'
import Input, { Form } from  '../../plugin/common/component/input'
import SimplePwd, { Password, modelPwd } from '../../plugin/common/component/simplePwd'

import $keyboard from '../../plugin/common/service/keyboard'
import { $popUp } from '../../plugin/common/service/ionic-lite'
import $log from '../../plugin/common/service/log'

import '../style/less/index.less'
/*
 * 组件定义, 通过继承Component实现
 * */
class payPwdPage extends Component {
    constructor(props) {
        super(props);
        let options = {show: 'complex'},
            options1 = {noChange: true},
            options2 = {show: 'complex', noChange: true},
            options3 = {show: 'complex', forget: $log.debug},
            options4 = {noForget: true};
        this.tapClick0 = this.tapClick.bind(this, null);
        this.tapClick1 = this.tapClick.bind(this, options);
        this.tapClick2 = this.tapClick.bind(this, options1);
        this.tapClick3 = this.tapClick.bind(this, options2);
        this.tapClick4 = this.tapClick.bind(this, options3);
        this.tapClick5 = this.tapClick.bind(this, options4);
        this.state = {
            option: {title: {value: '虚拟键盘+密码组件'}},
            inputList: [
                {text: '请输入数字', maxLen: 12, tap: this.tap.bind(this, 0), name: 'number'},
                {text: '请输入身份证', maxLen: 18, tap: this.tap.bind(this, 1), name: 'card'},
                {text: '请输入密码', maxLen: 6, tap: this.tap.bind(this, 2), name: 'password'}
            ],
            options: options,
            options1: options1,
            options2: options2
        }
    }

    tapClick(options) {
        modelPwd({
            options: options,
            submit: $log.debug
        });
    }

    tap(idx) {
        let inputs = this.state.inputList[idx],
            maxLen = inputs.maxLen || Number.MAX_VALUE,
            value = inputs.value || '';
        $keyboard[idx == 0 ? 'number' : idx == 1 ?
            'idCard' : 'simplePwd'](false, char => {
            if (char == 'back') {
                value = [].slice.call(value, 0, -1).join('');
            } else if (char == '确定' || value.length >= maxLen) {
                $keyboard.hide();
            } else if (char != '*') {
                value = value + '' + char;
                value.length >= maxLen && $keyboard.hide()
            }
            inputs.value = value, this.setState();
        })
    }

    render() {
        const {state} = this;
        let inputList = state.inputList || [],
            options = state.options,
            options1 = state.options1,
            options2 = state.options2;
        return (
            <Page option={state.option}>
                <Form btnTxt="提交">
                    {
                        inputList.map(item => <Input
                            name={item.name}
                            readonly="true"
                            onTap={item.tap}
                            value={item.value}
                            require={true}
                            placeholder={item.text}/>)
                    }
                </Form>
                <Password submit={$log.debug}/>
                <Password options={options} submit={$log.debug}/>
                <Password options={options1} submit={$log.debug}/>
                <Password options={options2} submit={$log.debug}/>
                <button onTap={this.tapClick0}>弹出框密码(默认)</button>
                <button onTap={this.tapClick1}>弹出框密码(复杂密码)</button>
                <button onTap={this.tapClick2}>弹出框密码(仅简单密码)</button>
                <button onTap={this.tapClick3}>弹出框密码(仅复杂密码)</button>
                <button onTap={this.tapClick4}>弹出框密码(复杂无忘记密码)</button>
                <button onTap={this.tapClick5}>弹出框密码(无忘记密码)</button>
            </Page>
        )
    }
}

export default payPwdPage
