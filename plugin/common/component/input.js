import Inferno from 'inferno';
import Component from 'inferno-component';
import { isFunction } from 'inferno-shared'
import { noop, valueFn, equals, forEach, trim, isPromiseLike } from '../service/common'

import $q from '../service/$q'
import { regExp } from '../constants/static'
import log from '../service/log'

import '../less/form.less'

export const skipValidate = valueFn({flag: true});

class Input extends Component {
    constructor(props) {
        super(props);
        let self = this;
        self.focusBlur = self.focusBlur.bind(self);
        self.input = self.input.bind(self);
        self.setValue = self.setValue.bind(self);
        self.clear = self.setValue.bind(self, null);
        self.state.value = props.value || '';
    }

    setValue(value) {
        let self = this,
            validate = self.props.validate || skipValidate,
            error = validate(value || '') || {};
        (isPromiseLike(error) ? error
            : $q.when(error)).then(function (res) {
            res = res.message || '';
            if (!equals(self.state.error, res) || !value)
                self.setState({
                    value: value || '', error: res
                })
        });

    }

    input(event) {
        this.setValue(event.target.value);
    }

    focusBlur(event) {
        var value = event.target.value,
            isFocus = event.type == 'focus';
        this.setState({
            value: value,
            isOn: isFocus || !!value,
            isFocus: isFocus
        });
    }

    componentWillReceiveProps(nextProps) {
        let self = this,
            validate = nextProps.validate || skipValidate,
            value = nextProps.value || '',
            error = value ? validate(value) || {} : {};
        (isPromiseLike(error) ? error
            : $q.when(error)).then(function (res) {
            self.setState({
                value: value || '', isOn: !!value, error: res.message
            })
        });
    }

    render(props, state) {
        let label = props.label || '',
            className = ['form-input'];
        props.className && className.push(props.className);
        props.children && className.push('small');
        state.error && className.push('error');
        state.isOn && className.push('on');
        state.isFocus && className.push('focus');
        return (
            <div className={className.join(' ')}>
                {
                    label ? <label>{label}</label> : ''
                }
                <input type={props.type || 'text'}
                       value={state.value}
                       autocomplete="off"
                       spellcheck="false"
                       maxlength={props.maxLength}
                       onTap={props.onTap || noop}
                       readonly={props.readonly}
                       placeholder={props.placeholder}
                       onFocus={this.focusBlur}
                       onBlur={this.focusBlur}
                       onInput={this.input}/>
                {
                    props.readonly ? '' : <i class="icon-font clear" onTap={this.clear}/>
                }
                <small class="err-tip">{state.error}</small>
                {props.children}
            </div>
        )
    }
}
export default Input;

export function isEmpty(label, value) {
    let isEmpty = !!trim(value || '').length;
    return {flag: isEmpty, message: isEmpty ? '' : label + '不能为空'}
}
export function isPhone(value) {
    let flag = regExp.phone.test(value),
        message = !value || flag ? '' : '手机号格式不正确';
    return {flag: flag, message: message}
}
export function maxLength(val, maxLen) {
    return {flag: trim(val || '').length == maxLen, message: ''}
}

export class Form extends Component {
    constructor(props) {
        super(props);
        let self = this;
        self.vMapEach = self.vMapEach.bind(self);
        self.structure = self.structure.bind(self);
        self.submit = self.submit.bind(self);
        self.keyDown = self.keyDown.bind(self);
        self.structure(true, props);
    }

    structure(isInit, props) {
        isInit && (this.vStore = {}, this.vMap = {});
        let self = this,
            children = (props || this.props).children || [],
            vStore = self.vStore;
        forEach(children, function (cd) {
            if (cd.type != Input) return;
            let props = cd.props, name = props.name,
                label = props.label || '', vdFn = props.validate;
            !isFunction(vdFn) ? vdFn = props.require ? isEmpty.bind(null, label) : valueFn({flag: true}) : '';
            if (isInit) {
                if (!name) return log.error('input must have [name] attribute');
                props.validate = self.validate.bind(self, vdFn, name);
                self.vStore[name] = props.value || '';
                self.vMap[name] = !!vdFn(props.value || '').flag;
            } else props.value = vStore[name];
        })
    }

    validate(vdFn, key, val) {
        let self = this, error = vdFn(val);
        self.vStore[key] = val;
        return (isPromiseLike(error) ? error
            : $q.when(error)).then(function (res) {
            self.vMap[key] = res.flag;
            return self.vMapEach(), res;
        });

    }

    vMapEach(isInit) {
        let self = this, invalid = null, vMap = self.vMap;
        for (let name in vMap) {
            if (invalid === false) break;
            invalid = vMap[name];
        }
        if (self.vInvalid === invalid) return;
        self.vInvalid = invalid;
        if (isInit) this.btnNode.disabled = !invalid
        else {
            self.structure(), this.btnNode.disabled = !invalid;
        }
    }

    submit(event) {
        let submit = this.props.submit;
        event.stopPropagation();
        isFunction(submit) && submit(this.vStore);
    }

    keyDown(event) {
        event.keyCode == '13' && !this.btnNode.disabled && this.submit(event);
    }

    componentDidMount() {
        let children = this._vNode.dom.children;
        this.btnNode = children[children.length - 1];
        this.vMapEach(true)
    }

    componentWillReceiveProps(nextProps) {
        this.structure(true, nextProps);
    }


    render(props, state) {
        let className = ['input-group'];
        props.className && className.push(props.className);
        return <div className={className.join(' ')} onKeyDown={this.keyDown}>
            {props.children}
            <button onTap={this.submit}>{props.btnTxt || '确定'}</button>
        </div>
    }
}

