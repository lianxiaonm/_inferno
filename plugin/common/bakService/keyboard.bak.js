import Inferno from 'inferno'
import {
    sliceArgs,
    toggleClass,
    $body,
    createSimpleEl,
    _st,
    addEventListener
} from '../service/common';

import { $popUp } from '../service/ionic-lite'
import Keyboard from '../component/keyboard'

let keyboardContent, popStack = 0,
    idCardKey = [1, 2, 3, 4, 5, 6, 7, 8, 9, 'X', 0],
    numberKey = [1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0],
    simplePwdKey = [1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0],
    undefined;
const $keyboard = {
    show: function (opts) {
        keyboardContent || (function () {
            $body.append(
                keyboardContent = createSimpleEl('div', {
                    className: 'keyboard'
                })
            );
            addEventListener(keyboardContent, 'tap', function (event) {
                event.target == keyboardContent && $keyboard.hide();
            });
        })();
        popStack++ ? this.hide(callback) : callback();
        function callback() {
            Inferno.render(
                <Keyboard keys={opts.keys}
                          others={opts.others}
                          tapClick={opts.tapClick}/>,
                keyboardContent
            );
            _st(()=> {
                $popUp.setPosition('top');
                toggleClass(keyboardContent, 'active', true);
            }, 16.7);
        }
    },
    hide: function (callback) {
        toggleClass(keyboardContent, '_hide', true);
        $popUp.setPosition('top', true);
        _st(()=> {
            popStack && popStack--;
            toggleClass(keyboardContent, 'active _hide');
            callback && callback.apply(null, sliceArgs(arguments, 1))
        }, 400);
    },
    number: function (isNine, callback) {
        this.show({
            keys: numberKey.concat(isNine ? 'back' : 'hide'),
            others: isNine ? undefined : ['back', '确定'],
            tapClick: callback
        });
    },
    idCard: function (isNine, callback) {
        this.show({
            keys: idCardKey.concat(isNine ? 'back' : 'hide'),
            others: isNine ? undefined : ['back', '确定'],
            tapClick: callback
        });
    },
    simplePwd: function (isNine, callback) {
        this.show({
            keys: simplePwdKey.concat(isNine ? 'back' : 'hide'),
            others: isNine ? undefined : ['back', '确定'],
            tapClick: callback
        });
    }
};
export default $keyboard;