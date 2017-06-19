import Inferno from 'inferno';
import Component from 'inferno-component';
import { isFunction } from 'inferno-shared'
import { equals, upChange } from '../service/common'

import $keyboard from '../service/keyboard'
import Input, { isEmpty } from './input'
import { $popUp } from '../service/ionic-lite'
import { MadePop } from './ionic-lite-cp'

import '../less/simplePwd.less'

export default class SimplePwd extends Component {
    constructor(props) {
        super(props);
        this.tapClick = this.tapClick.bind(this);
        this.state.password = '';
    }

    tapClick() {
        $keyboard.simplePwd(true, char => {
            let value = this.state.password,
                maxLen = this.props.len || 6;
            if (char == 'back') {
                value = [].slice.call(value, 0, -1).join('');
            } else if (char == '确定' || value.length >= maxLen) {
                $keyboard.hide();
            } else if (char != '*') {
                value = value + '' + char;
                value.length >= maxLen && $keyboard.hide();
            }
            if (!equals(this.state.password, value)) {
                this.setState({password: value});
                upChange.call(this, value);
            }
        });
    }

    componentWillReceiveProps(nextProps) {
        nextProps.clear && this.setState({password: ''});
    }

    render() {
        let {props, state} = this,
            pwdLength = state.password.length,
            liList = [], length = props.len || 6,
            className = ['simple-pwd'];
        props.className && className.push(props.className);
        for (var i = 0; i < length; i++) {
            liList.push(i < pwdLength ? '●' : '&nbsp;')
        }
        return (
            <ul className={className.join(' ')} onTap={this.tapClick}>
                {
                    liList.map(item => <li
                        dangerouslySetInnerHTML={{__html: item}}/>)
                }
            </ul>
        )
    }
}
export class Password extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: (props.options || {}).show || 'simple'
        }
        this.change = this.change.bind(this);
        this.vMapEach = this.vMapEach.bind(this);
        this.isEmpty = this.isEmpty.bind(this, 'pwd');
        this.simpleChange = this.simpleChange.bind(this);
        this.submit = this.submit.bind(this);
        this.vStore = {};
    }

    change() {
        this.setState({
            show: this.state.show == 'simple' ? 'complex' : 'simple'
        });
    }

    isEmpty(key, value) {
        this.vStore[key] = value;
        this.vMapEach();
        return isEmpty('密码', value);
    }

    vMapEach() {
        let pwd = this.vStore.pwd,
            show = this.state.show;
        this.btnNode.disabled = show == 'simple' ? pwd.length < 6 : pwd.length < 6;
    }

    simpleChange(value) {
        this.vStore['pwd'] = value;
        this.vMapEach();
    }

    submit() {
        let submit = this.props.submit;
        isFunction(submit) && submit(this.vStore);
    }

    componentDidMount() {
        let domNode = this._vNode.dom;
        this.btnNode = domNode.querySelector('button');
    }

    componentWillReceiveProps(nextProps) {
        let options = this.props.options || {},
            nextOpts = nextProps.options || {};
        if (!equals(options.show, nextOpts.show))
            this.setState({
                show: nextOpts.show || 'simple'
            })
    }

    render() {
        let {props, state} = this,
            option = props.options || {},
            show = state.show || 'simple',
            className = ['pwd-group'],
            cName = show == 'simple' ? '复杂密码' : '简单密码';
        className.push(show == 'simple' ? 'simple' : 'default');
        return (
            <div className={className.join(' ')}>
                <h4>请输入支付密码</h4>
                {props.children}
                <SimplePwd len={option.len || 6} change={this.simpleChange} clear={true}/>
                <Input label="支付密码" type="password" name="password" maxLength="16" validate={this.isEmpty}/>
                <p className="corner">
                    {
                        option.noChange ? '' : <a onTap={this.change}>{cName}</a>
                    }
                    {
                        isFunction(option.forget) ? <a onTap={option.forget}>忘记密码</a> : ''
                    }
                </p>
                <button disabled onTap={this.submit}>下一步</button>
            </div>
        )
    }
}

export function modelPwd(opts) {
    $popUp.show({
        content: (
            <MadePop title="请输入支付密码" className="pwd">
                <Password options={opts.options} submit={opts.submit}>
                    {opts.children}
                </Password>
            </MadePop>
        )
    })
}

