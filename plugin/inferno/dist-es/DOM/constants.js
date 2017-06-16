import { makeMap } from 'inferno-shared'
export const xlinkNS = 'http://www.w3.org/1999/xlink';
export const xmlNS = 'http://www.w3.org/XML/1998/namespace';
export const svgNS = 'http://www.w3.org/2000/svg';
const TRUE = true;
export const strictProps = makeMap([
    'volume', 'defaultChecked'
], Object.create(null), TRUE);
Object.freeze(strictProps);
export const booleanProps = makeMap([
    'muted', 'scoped', 'loop',
    'open', 'checked', 'default',
    'capture', 'disabled', 'readOnly',
    'required', 'autoplay', 'controls',
    'seamless', 'reversed', 'allowfullscreen',
    'novalidate', 'hidden', 'autoFocus'
], Object.create(null), TRUE);
Object.freeze(booleanProps);
let _namespaces = makeMap([
    'xlink:href', 'xlink:arcrole',
    'xlink:actuate', 'xlink:show',
    'xlink:role', 'xlink:title', 'xlink:type'
], Object.create(null), xlinkNS);
export const namespaces = makeMap([
    'xml:base', 'xml:lang', 'xml:space'
], _namespaces, xmlNS);
Object.freeze(namespaces);
export const isUnitlessNumber = makeMap([
    'animationIterationCount', 'borderImageOutset', 'borderImageSlice',
    'borderImageWidth', 'boxFlex', 'boxFlexGroup', 'boxOrdinalGroup',
    'columnCount', 'flex', 'flexGrow', 'flexPositive', 'flexShrink',
    'flexNegative', 'flexOrder', 'gridRow', 'gridColumn', 'fontWeight',
    'lineClamp', 'lineHeight', 'opacity', 'order', 'orphans', 'tabSize',
    'widows', 'zIndex', 'zoom', 'fillOpacity', 'floodOpacity', 'stopOpacity',
    'strokeDasharray', 'strokeDashoffset', 'strokeMiterlimit', 'strokeOpacity', 'strokeWidth'
], Object.create(null), TRUE);
Object.freeze(isUnitlessNumber);
export const skipProps = makeMap([
    'children', 'childrenType', 'defaultValue',
    'ref', 'key', 'selected', 'checked', 'multiple'
], Object.create(null), TRUE);
Object.freeze(skipProps);
let events = [
    'onClick', 'onSubmit', 'onKeyDown', 'onKeyUp', 'onKeyPress',
    //拓展自定义事件
    'onTap', 'onLongTap', 'onHold', 'onDragStart', 'onDragEnd'
];
['onDrag', 'onSwipe', 'onFlick'].forEach(function (val) {
    events = events.concat([name, name + 'Left', name + 'Right', name + 'Up', name + 'Down']);
});
export const delegatedEvents = makeMap(events, Object.create(null), TRUE);
Object.freeze(delegatedEvents);
