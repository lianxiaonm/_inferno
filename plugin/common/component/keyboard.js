import Inferno from 'inferno';
import Component from 'inferno-component';

import { noop } from '../service/common'
import $keyboard from '../service/keyboard';

import '../less/layout.less'
import '../less/keyboard.less'

const getClazz = function (n, clz = []) {
    /[a-z|A-Z]/.test(n) ? clz.push('key-' + n)
        : /\*/.test(n) && clz.push('key-disabled');
    return clz.join(' ');
}

export default class Keyboard extends Component {
    constructor(props) {
        super(props);
        this.tapClick = this.tapClick.bind(this);
    }

    tapClick(event) {
        var target = event.target, result;
        if (target.tagName == 'LI') {
            result = target.innerHTML;
            result != 'hide' ? result != '*' && this._tapClick(result) : $keyboard.hide();
        }
    }

    render(props, state) {
        let keys = props.keys || [],
            others = props.others || [],
            className = ['key-body', 'm-row'];
        this._tapClick = props.tapClick || noop;
        props.screen && className.push(props.screen);
        others.length || className.push('keyAll');
        return (
            <div className={className.join(' ')} onTap={this.tapClick}>
                <h5>壹钱包安全键盘</h5>
                <ul className="col number m-row">
                    {
                        keys.map(item=><li className={getClazz(item,['col-4'])}>{item}</li>)
                    }
                </ul>
                <ul className="col num-other">
                    {
                        others.map(item=><li className={getClazz(item)}>{item}</li>)
                    }
                </ul>
            </div>
        )
    }
}

