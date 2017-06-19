import Inferno from 'inferno';
import Component from 'inferno-component';
import { isFunction } from 'inferno-shared'
import { inherit, extend } from '../service/common'

import Input, { Form, isPhone, maxLength } from './input'
import BaseHttpRequest from '../util/httpRequest'
import { $loading, $popUp } from '../service/ionic-lite'
import { MadePop } from './ionic-lite-cp'
import log  from '../service/log'

import '../less/form.less'

export default class Otp extends Component {
    constructor(props) {
        super(props);
        let self = this;
        self.tap = self.tap.bind(self);
        self.countdown = self.countdown.bind(self);
        self.refresh = self.refresh.bind(self);
        self.submit = self.submit.bind(self);
        self.state = {
            btnTxt: '获取',
            normal: [
                {
                    name: 'phone', label: '手机号', type: 'tel', maxLength: 11, readonly: props.readonly, require: true,
                    validate: self.validate.bind(self, 'phone')
                },
                {
                    name: 'code', label: '短信验证码', type: 'tel', maxLength: 6,
                    validate: self.validate.bind(self, 'code')
                }
            ],
            special: [
                {
                    name: 'picCode', label: '图片验证码', type: 'text', maxLength: 4, require: true,
                    validate: self.validate.bind(self, 'picCode')
                }
            ]
            //picSrc: 'https://cashier.1qianbao.com/gtproxy/captchacode/code/9/3f5d1468-06f9-46c4-bf03-c1d7ef5038bd'   //图片验证码地址
        };
        self.vStore = {phone: props.phone}; //数据仓库
        self.count = 60, self.send = 0;
    }

    tap() {
        let self = this,
            store = self.vStore,
            trySendSms = self.props.trySendOtp || otpService.trySendOTP;
        if (!isFunction(trySendSms))
            return log.error('trySendOtp is not function');
        let phone = store.phone,
            captchaToken = store.captchaToken,
            deviceId = store.deviceId || '', extraData;
        if (!isPhone(phone).flag)
            return log.debug('phone number is invalid');
        extraData = extend({}, self.props.extraData);
        self.send || ++self.send && trySendSms.call(otpService, phone,
            captchaToken, deviceId, extraData).then(function (res) {
            let code = res.code, data = res.data || {};
            --self.send;
            if (code == '000000') self.countdown();
            else if (code == '000001') {
                store.captchaId = data.captchaId;
                self.setState({
                    picSrc: data.captchaUrl
                });
            } else $loading(res.message, 2000);
        }, () => --self.send);
    }

    countdown() {
        let self = this;
        self.timer = setInterval(() => {
            let _count = self.count--;
            self.setState({btnTxt: _count <= 0 ? '重新获取' : _count + 's'});
            if (_count < 0) {
                clearInterval(self.timer);
                self.count = 60, --self.send;
            }
        }, 1000), ++self.send;
    }

    refresh() {
        let self = this,
            store = self.vStore;
        otpService.refreshCaptcha().then(function (res) {
            let data = res.data || {};
            if (res.code == '000000') {
                store.captchaId = data.captchaId;
                self.setState({
                    picSrc: data.captchaUrl + "?r=" + Math.random()
                })
            }
        });
    }

    validate(key, val) {
        this.vStore[key] = val;
        return key == 'phone' ? isPhone(val) : key == 'picCode' ?
            maxLength(val, 4) : key == 'code' ? maxLength(val, 6) : {flag: false};
    }

    submit(form) {
        let self = this,
            store = self.vStore;
        self.state.picSrc ? otpService.verifyCaptcha({
            captchaInput: store.picCode,
            captchaId: store.captchaId
        }).then(function (res) {
            if (res.code == '000000') {//图片验证码正确
                store.captchaToken = res.data.captchaToken;
                self.setState({picSrc: null})
            } else $loading('验证码输入不正确', 2000);
        }) : self.props.submit && self.props.submit(store);
    }

    render() {
        let {state} = this,
            store = this.vStore;
        return <Form submit={this.submit} btnTxt="提交">
            {
                state.picSrc ? state.special.map(item => {
                    let value = store[item.name];
                    return <Input
                        label={item.label}
                        name={item.name}
                        type={item.type}
                        maxLength={item.maxLength}
                        require={item.require}
                        validate={item.validate}
                        value={value}>
                        <img className="r_btn" onTap={this.refresh} src={state.picSrc}/>
                    </Input>
                }) : state.normal.map((item, idx) => {
                    let value = store[item.name];
                    return <Input
                        label={item.label}
                        name={item.name}
                        type={item.type}
                        maxLength={item.maxLength}
                        readonly={item.readonly}
                        require={item.require}
                        validate={item.validate}
                        value={value}>
                        {
                            idx == 1 ? <span className="r_btn" onTap={this.tap}>{state.btnTxt}</span> : ''
                        }
                    </Input>
                })
            }
        </Form>
    }
}

export function otpModal(opts) {
    $popUp.show({
        content: <MadePop title="验证码" className="otp">
            <Otp readonly={opts.readonly}
                 phone={opts.phone}
                 submit={opts.submit}/>
        </MadePop>
    })
}

//
function Child() {
    BaseHttpRequest.call(this);
    this.logAPIUniqueKey = "[OTPService]";
    this.trySendOtpDto = function (result) {
        if (result.code == "1000") result.code = "000000";
        if (result.code == "000000") {
        } else if (result.code == "1184") {
            result.code = "000001";
        } else if (result.code == "1185") {
            result.code = "000002";
        }
        return result;
    };
    this.refreshCaptchaDto = function (result) {
        if (result.code == "1000") {
            result.code = "000000";
        }
        return result;
    };
    this.verifyCaptchaDto = function (result) {
        if (result.code == "1000") {
            result.code = "000000";
        }
        return result;
    };
}
inherit(Child, BaseHttpRequest);
extend(Child.prototype, {
    trySendOTP: function (phone, captchaToken, deviceId, extraData) {
        return this.postRequest('/h5/cma_send_otp_msg.json',
            this.getRequestData({
                operationType: "/h5/cma_send_otp_msg.json",
                phone: phone,
                captchaToken: captchaToken
            }, extraData), this.trySendOtpDto)
    },
    refreshCaptcha: function (extraData) {
        return this.postRequest('/h5/refresh_img_code.json',
            this.getRequestData({
                operationType: "/h5/refresh_img_code.json"
            }, extraData), this.refreshCaptchaDto);
    },
    verifyCaptcha: function (captcha, extraData) {
        return this.postRequest('/h5/cma_verify_img_code.json',
            this.getRequestData({
                operationType: "/h5/cma_verify_img_code.json",
                captchaInput: captcha.captchaInput,
                captchaId: captcha.captchaId
            }, extraData), this.verifyCaptchaDto);
    }
});
export const otpService = new Child();

