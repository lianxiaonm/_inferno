import Inferno from 'inferno';
import Keyboard from '../component/keyboard'
import { model } from './ionic-lite';

let idCardKey = [1, 2, 3, 4, 5, 6, 7, 8, 9, 'X', 0],
    numberKey = [1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0],
    simplePwdKey = [1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0],
    undefined;
const $keyboard = {
    show: function (opts) {
        model(<Keyboard keys={opts.keys} others={opts.others}
                        screen={opts.screen} tapClick={opts.tapClick}/>, '');
    },
    hide: model.hide,
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