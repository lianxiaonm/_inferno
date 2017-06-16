import Inferno from 'inferno';
import Component from 'inferno-component';

import { equals } from '../service/common'
import { $popUp } from '../service/ionic-lite'

import '../less/ionic.less'

//simple组件父类
export class baseComponent extends Component {
    shouldComponentUpdate(props) {
        return !equals(props, this.props);
    }
}

export class Popup extends baseComponent {
    render(props) {
        let btns = props.btns || [],
            children = props.children;
        return (
            <div className="popup">
                {
                    props.title &&
                    <div className="popup-head">
                        <h3 className="popup-title">{props.title}</h3>
                        {
                            props.subTitle &&
                            <h5 className="popup-sub-title">
                                {props.subTitle}
                            </h5>
                        }
                    </div>
                }
                <div className="popup-body">{children}</div>
                {
                    btns.length ?
                        <div className="popup-btns">
                            {
                                btns.map((item, idx) => {
                                    let clazz = 'btn ' + (item.type || 'btn-default'),
                                        tapClick = $popUp.hide.bind($popUp, props.onTap, idx, children);
                                    return <span onTap={tapClick} className={clazz}>{item.text}</span>
                                })
                            }
                        </div> : ''

                }
            </div>
        )
    }
}
//类 alert
export class MadePop extends Component {
    constructor(props) {
        super(props);
        this.close = $popUp.hide.bind($popUp, null);
    }

    render(props, state) {
        let className = ['made-body'];
        props.className && className.push(props.className);
        return (
            <div className={className.join(' ')}>
                <h3 className="made-title">{props.title}
                    <em className="icon-font" onTap={this.close}>&#xe646;</em>
                </h3>
                {props.children}
            </div>
        )
    }
}

export class ActionSheet extends baseComponent {
    tapClick(item, idx, event) {
        this.props.tap && this.props.tap(arguments);
        return event.stopPropagation();
    }

    render(prop, state) {
        let btnList = prop.btnList || [];
        return (
            <div className="action-sheet">
                <ul className="item-view">
                    {
                        btnList.map((item, idx) => {
                            let txt = item.txt == null ? item : item.txt,
                                tapClick = this.tapClick.bind(this, item, idx);
                            return <li onTap={tapClick} className="item-list">{txt}</li>
                        })
                    }
                </ul>
                <ul className="item-view">
                    <li className="item-list cancel" onTap={this.tapClick.bind(this, null, null)}>取消</li>
                </ul>
            </div>
        )
    }
}

export class Loading extends baseComponent {
    constructor(props) {
        super(props);
        this.init = this.init.bind(this);
    }

    init(props) {
        let spinnerName = props.icon || 'ios',
            spinner = window.svgHelper.spinners[spinnerName];
        if (!spinner) {
            this._html = spinnerName, this._className = ['toast']
        } else {
            let container = document.createElement('div');
            window.svgHelper.createSvgElement('svg', {
                viewBox: '0 0 64 64',
                g: [spinner]
            }, container, spinnerName);
            this._className = ['spinner', 'spinner-' + spinnerName];
            this._html = container.innerHTML;
        }
    }

    render(props) {
        this.init(props);
        return <div className={(this._className || []).join(' ')}
                    dangerouslySetInnerHTML={{__html: this._html}}/>
    }
}
