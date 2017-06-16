import Inferno from 'inferno';
import Component from 'inferno-component';

import { stop, equals } from  '../service/common'
import { MadePop } from './ionic-lite-cp'
import { $popUp, model } from '../service/ionic-lite'

import '../less/checkBox.less'

export default class CheckBox extends Component {
    constructor(props) {
        super(props);
        this.state = this.initIdx(props);
    }

    tap(type, item, idx, event) {
        let idxMap = this.state.idx, index,
            checkFn = this.props.checkFn;
        if (type == 'single') {
            idxMap = [idx];
        } else {
            index = idxMap.indexOf(idx);
            index == -1 ? idxMap.push(idx) : idxMap.splice(index, 1);
        }
        checkFn && checkFn(type, idxMap);
        this.setState({idx: idxMap});
    }

    initIdx(props) {
        return {idx: props.checkList || []}
    }

    componentWillReceiveProps(nextProps) {
        equals(nextProps, this.props) || this.setState(this.initIdx(nextProps));
    }

    render(props, state) {
        let type = props.type || 'single',//single 单选， multiple 多选
            className = ['item-view'].concat(type == 'single' ? 'single' : 'multiple'),
            valList = props.values || [];
        props.className && className.push(props.className);
        return (
            valList.length ? <ul className={className.join(' ')}>
                {
                    valList.map((item, idx)=> {
                        let tapClick = item.disabled ? stop : this.tap.bind(this, type, item, idx),
                            className = ['item-list'];
                        item.disabled && className.push('disabled');
                        item.disabled || state.idx.indexOf(idx) != -1 && className.push('on');
                        return <li onTap={tapClick} className={className.join(' ')}>{item.text}</li>
                    })
                }
            </ul> : ''
        )
    }
}

let checked = {}, _opts;
function checkBoxFn(type, idxMap) {
    checked = {type: type, idxMap: idxMap};
}
function tapBtn(callback, event) {
    $popUp.hide(callback, checked, event);
}

export function dialogCkBox(options) {
    equals(options, _opts) || (checked = {}, _opts = options);
    $popUp.show({
        content: (
            <MadePop title="请选择" className="check-box">
                <CheckBox type={options.type}
                          values={options.values}
                          className={options.className}
                          checkList={options.checkList}
                          checkFn={checkBoxFn}/>
                <button onTap={tapBtn.bind(null,options.checkFn)}>确定</button>
            </MadePop>
        )
    })
}

function tapBtn1(callback, event) {
    model.hide(callback, checked, event);
}

export function modelCkBox(options, opts) {
    equals(options, _opts) || (checked = {}, _opts = options);
    model(
        <div className="pop-check">
            <div className="pop-check-title">
                {options.title || '请选择'}
                <em className="icon-font" onTap={tapBtn1.bind(null,options.checkFn)}>&#xe645;</em>
            </div>
            <CheckBox type={options.type}
                      values={options.values}
                      className={options.className}
                      checkList={options.checkList}
                      checkFn={checkBoxFn}/>
        </div>, opts || {}
    )
}