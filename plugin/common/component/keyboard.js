import Inferno, { linkEvent } from 'inferno';
import { noop } from '../service/common'
import $keyboard from '../service/keyboard';

import '../less/layout.less'
import '../less/keyboard.less'

const getClazz = function (n, clz = []) {
    /[a-z|A-Z]/.test(n) ? clz.push('key-' + n)
        : /\*/.test(n) && clz.push('key-disabled');
    return clz.join(' ');
}
const tapClick = function (props, event) {
    var target = event.target, result;
    if (target.tagName == 'LI') {
        result = target.innerHTML;
        switch (result) {
            case 'hide':
                return $keyboard.hide();
            case '*':
                return;
            default:
                (props.tapClick || noop)(result);
        }
    }
}

export default function Keyboard(props) {
    let keys = props.keys || [],
        others = props.others || [],
        className = ['key-body', 'm-row'];
    props.screen && className.push(props.screen);
    others.length || className.push('keyAll');
    return (
        <div className={className.join(' ')} onTap={linkEvent(props, tapClick)}>
            <h5>壹钱包安全键盘</h5>
            <ul className="col number m-row">
                {
                    keys.map(item => <li className={getClazz(item, ['col-4'])}>{item}</li>)
                }
            </ul>
            <ul className="col num-other">
                {
                    others.map(item => <li className={getClazz(item)}>{item}</li>)
                }
            </ul>
        </div>
    )
}

