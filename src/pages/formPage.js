//公共模块
import Inferno from 'inferno';
import Component from 'inferno-component';

import Page from '../../plugin/common/component/page'
import Input,{ Form } from  '../../plugin/common/component/input'
import Otp,{ otpModal } from '../../plugin/common/component/otp'

import { $popUp } from '../../plugin/common/service/ionic-lite'
import log from '../../plugin/common/service/log'

import $http from '../../plugin/common/service/http'
import infernoService from '../service/infernoService'

import '../style/less/index.less'
/*
 * 组件定义, 通过继承Component实现
 * */
class formPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            option: {title: {value: 'form表单'}},
            inputs: [{
                label: '昵称', name: 'nickName', require: true, placeholder: '请输入昵称'
            }, {
                label: '年龄', name: 'age', type: 'number', placeholder: '请输入年龄',
                children: <span className="r_btn">年龄说明</span>
            }, {
                label: '用户名', name: 'userName', placeholder: '请输入用户名'
            }, {
                label: '密码', name: 'password', type: 'password', className: 'flt', placeholder: '请输入密码'
            }, {
                label: '新密码', name: 'rePassword', type: 'password', className: 'flt', placeholder: '输入新密码'
            }, {
                label: '金额', name: 'payMoney', type: 'number', className: 'flt', placeholder: '请输入支付金额',
                children: <span className="r_btn">限定说明</span>
            }]
        }
        this.confirm = this.confirm.bind(this);
        this.submit = this.submit.bind(this);
    }

    componentDidMount() {
        let time = new Date().getTime(),
            self = this;
        //$http.get('http://localhost:20003/index.html')
        //infernoService.getBaiduHtml().then(function (res) {
        //    console.log(new Date().getTime() - time);
        //    setTimeout(()=>self.setState({
        //        inputs: self.state.inputs.slice(0, -1)
        //    }), 3000);
        //})
    }

    confirm() {
        otpModal({
            phone: '18964367337',
            submit: function () {
                console.log(arguments)
            }
        });
    }

    submit(form) {
        console.log(form);
    }


    render(prop, state) {
        return (
            <Page option={state.option}>
                <Form submit={this.submit}>
                    {
                        state.inputs.map(item=> <Input
                            label={item.label}
                            name={item.name}
                            className={item.className}
                            type={item.type}
                            value={item.value}
                            maxLength={item.maxLength}
                            readonly={item.readonly}
                            validate={item.validate}
                            placeholder={item.placeholder}
                            require={item.require}>
                            {item.children}
                        </Input>)
                    }
                </Form>
                <Otp phone="18964367337" readonly={true}/>
                <button onTap={this.confirm}>otp弹框</button>
            </Page>
        )
    }
}

export
default
formPage
