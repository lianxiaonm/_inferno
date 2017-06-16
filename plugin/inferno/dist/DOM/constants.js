"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
var inferno_shared_1 = require("inferno-shared"),
    makeMap = inferno_shared_1.makeMap;
exports.xlinkNS = 'http://www.w3.org/1999/xlink';
exports.xmlNS = 'http://www.w3.org/XML/1998/namespace';
exports.svgNS = 'http://www.w3.org/2000/svg';
var TRUE = true;
exports.strictProps = makeMap([
    'volume', 'defaultChecked'
], Object.create(null), TRUE);
Object.freeze(exports.strictProps);
exports.booleanProps = makeMap([
    'muted', 'scoped', 'loop',
    'open', 'checked', 'default',
    'capture', 'disabled', 'readOnly',
    'required', 'autoplay', 'controls',
    'seamless', 'reversed', 'allowfullscreen',
    'novalidate', 'hidden', 'autoFocus'
], Object.create(null), TRUE);
Object.freeze(exports.booleanProps);
var namespaces = makeMap([
    'xlink:href', 'xlink:arcrole',
    'xlink:actuate', 'xlink:show',
    'xlink:role', 'xlink:title', 'xlink:type'
], Object.create(null), exports.xlinkNS);
exports.namespaces = makeMap([
    'xml:base', 'xml:lang', 'xml:space'
], namespaces, exports.xmlNS);
Object.freeze(exports.namespaces);
exports.isUnitlessNumber = makeMap([
    'animationIterationCount', 'borderImageOutset', 'borderImageSlice',
    'borderImageWidth', 'boxFlex', 'boxFlexGroup', 'boxOrdinalGroup',
    'columnCount', 'flex', 'flexGrow', 'flexPositive', 'flexShrink',
    'flexNegative', 'flexOrder', 'gridRow', 'gridColumn', 'fontWeight',
    'lineClamp', 'lineHeight', 'opacity', 'order', 'orphans', 'tabSize',
    'widows', 'zIndex', 'zoom', 'fillOpacity', 'floodOpacity', 'stopOpacity',
    'strokeDasharray', 'strokeDashoffset', 'strokeMiterlimit', 'strokeOpacity', 'strokeWidth'
], Object.create(null), TRUE);
Object.freeze(exports.isUnitlessNumber);
exports.skipProps = makeMap([
    'children', 'childrenType', 'defaultValue',
    'ref', 'key', 'selected', 'checked', 'multiple'
], Object.create(null), TRUE);
Object.freeze(exports.skipProps);
var events = [
    'onClick', 'onSubmit', 'onKeyDown', 'onKeyUp', 'onKeyPress',
    'onTouchStart', 'onTouchMove', 'onTouchEnd', 'onTouchCancel',
    //拓展自定义事件
    'onTap', 'onLongTap', 'onHold', 'onDragStart', 'onDragEnd'
];
['onDrag', 'onSwipe', 'onFlick'].forEach(function (val) {
    events = events.concat([val, val + 'Left', val + 'Right', val + 'Up', val + 'Down']);
});
exports.delegatedEvents = makeMap(events, Object.create(null), TRUE);
Object.freeze(exports.delegatedEvents);
