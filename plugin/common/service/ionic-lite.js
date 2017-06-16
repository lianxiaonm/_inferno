import Inferno from 'inferno'
import $$raf from './raf';
import {
    sliceArgs, extend, valueFn, noop,
    forEach, toggleClass, $body,
    createSimpleEl, addEventListener
} from './common';

import { Popup, Loading, ActionSheet } from '../component/ionic-lite-cp'

import '../less/ionic.less'

let dropEl = createSimpleEl('div', {
        className: 'backdrop-container'
    }),
    dropHolds = 0;
$body.append(dropEl);
export const $backdrop = {
    retain: function () {
        ++dropHolds && $$raf(function () {
            toggleClass(dropEl, 'active', true), $body.locked();
        });
    },
    release: function () {
        --dropHolds || $$raf(function () {
            toggleClass(dropEl, 'active'), $body.locked(true);
        });
    },
    _element: dropEl
};
let loadingContent, loadingTimer;
export const $loading = function (icon, diur, call) {
    loadingContent || $body.append(
        loadingContent = createSimpleEl('div', {
            className: 'loading-container'
        })
    );
    loadingTimer && (clearTimeout(loadingTimer), $backdrop.release());
    $backdrop.retain();
    $$raf(() => toggleClass(loadingContent, 'active', true));
    loadingTimer = setTimeout(() => {
        toggleClass(loadingContent, 'active');
        loadingTimer = null;
        $backdrop.release(), call && call();
    }, diur || 30 * 1000);
    Inferno.render(<Loading icon={icon}/>, loadingContent)
};
$loading.hide = function () {
    loadingTimer && clearTimeout(loadingTimer);
    $backdrop.release(), loadingTimer = null;
    $$raf(() => toggleClass(loadingContent, 'active'));
};

let popContent, popStack = 0;
export const $popUp = {
    show: function (opts) {
        popContent || $body.append(
            popContent = createSimpleEl('div', {
                className: 'popup-container'
            })
        );
        popStack++ ? this.hide(callback) : callback();
        function callback() {
            Inferno.render(
                <Popup title={opts.title} btns={opts.btns} subTitle={opts.subTitle}
                       onTap={opts.tap || noop}>{opts.content}</Popup>,
                popContent
            );
            $backdrop.retain();
            setTimeout(() => toggleClass(popContent, 'active', true), 16.7);
        }
    },
    hide: function (callback) {
        toggleClass(popContent, 'popup-hide', true);
        forEach(arguments, item => {item instanceof Event && item.stopPropagation()});
        setTimeout(() => {
            popStack && (popStack--, $backdrop.release());
            toggleClass(popContent, 'active popup-hide');
            callback && callback.apply(null, sliceArgs(arguments, 1))
        }, 300);
    },
    setPosition: function (clazz, reset) {
        if (popContent) {
            popContent.classList.contains('active') ?
                toggleClass(popContent, clazz, !reset) :
                toggleClass(popContent, clazz);
        }
    },
    alert: function (opts) {
        opts || (opts = {});
        this.show(extend({
            btns: [{
                text: opts.okText || '确定',
                type: opts.okType || 'btn-positive'
            }], tap: valueFn(true)
        }, opts))
    },
    confirm: function (opts) {
        opts || (opts = {});
        this.show(extend({
            btns: [{
                text: opts.cancelText || '关闭',
                type: opts.cancelType || 'btn-default'
            }, {
                text: opts.okText || '确定',
                type: opts.okType || 'btn-positive'
            }], tap: valueFn(true)
        }, opts))
    }
};

let modelContent, modelStack = 0, modelOpts;
/**
 * @param content
 * @param options 后期拓展用的参数
 */
export const model = function (content, options) {
    modelContent || (function () {
        $body.append(
            modelContent = createSimpleEl('div', {
                className: 'model-container'
            })
        );
        addEventListener(modelContent, 'tap', function (event) {
            event.target == modelContent && model.hide();
        })
    })();
    modelStack++ ? this.hide(callback) : callback();
    function callback() {
        modelOpts = extend({className: '', setPosition: 'top'}, options || {});
        Inferno.render(content, modelContent), $backdrop.retain();
        setTimeout(() => {
            $popUp.setPosition(modelOpts.setPosition);
            toggleClass(modelContent, 'active', true);
        }, 16.7);
    }
}
model.hide = function (callback) {
    toggleClass(modelContent, 'active');
    $popUp.setPosition(modelOpts.setPosition, true);
    setTimeout(() => {
        modelStack && (modelStack--, $backdrop.release());
        callback && callback.apply(null, sliceArgs(arguments, 1));
    }, 500);
};
export function $sheet(btnList, callback) {
    model(<ActionSheet btnList={btnList} tap={item => {
        model.hide(item != null ? callback : null, item);
    }}/>, '');
}