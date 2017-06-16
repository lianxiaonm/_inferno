(function (document, window) {
    var TRANSLATE32 = 'translate(32,32)',
        STROKE_OPACITY = 'stroke-opacity',
        ROUND = 'round',
        INDEFINITE = 'indefinite',
        DURATION = '750ms',
        NONE = 'none';
    var SHORTCUTS = {
        a: 'animate',
        an: 'attributeName',
        at: 'animateTransform',
        c: 'circle',
        da: 'stroke-dasharray',
        os: 'stroke-dashoffset',
        f: 'fill',
        lc: 'stroke-linecap',
        rc: 'repeatCount',
        sw: 'stroke-width',
        t: 'transform',
        v: 'values'
    };
    var SPIN_ANIMATION = {
        v: '0,32,32;360,32,32',
        an: 'transform',
        type: 'rotate',
        rc: INDEFINITE,
        dur: DURATION
    };

    function createSvgElement(tagName, data, parent, spinnerName) {
        var key, x, xx, y, yy, _data, _data_x,
            ele = document.createElement(SHORTCUTS[tagName] || tagName);
        for (key in data) {
            if ((_data = data[key]) instanceof Array) {
                for (x = 0, xx = _data.length; x < xx; x++) {
                    if ((_data_x = _data[x]).fn) {
                        for (y = 0, yy = _data_x.t; y < yy; y++) {
                            createSvgElement(key, _data_x.fn(y, spinnerName), ele, spinnerName);
                        }
                    } else {
                        createSvgElement(key, _data_x, ele, spinnerName);
                    }
                }
            } else {
                setSvgAttribute(ele, key, _data);
            }
        }
        parent.appendChild(ele);
    }

    function setSvgAttribute(ele, k, v) {
        ele.setAttribute(SHORTCUTS[k] || k, v);
    }

    function animationValues(strValues, i) {
        var values = strValues.split(';'),
            back = values.slice(i),
            front = values.slice(0, values.length - back.length);
        values = back.concat(front).reverse();
        return values.join(';') + ';' + values[0];
    }

    var IOS_SPINNER = {
        sw: 4,
        lc: ROUND,
        line: [{
            fn: function (i, spinnerName) {
                return {
                    y1: spinnerName == 'ios' ? 18 : 13,
                    y2: spinnerName == 'ios' ? 29 : 20,
                    t: TRANSLATE32 + ' rotate(' + (30 * i + (i < 6 ? 180 : -180)) + ')',
                    a: [{
                        fn: function () {
                            return {
                                an: STROKE_OPACITY,
                                dur: DURATION,
                                v: animationValues('0;.1;.15;.25;.35;.45;.55;.65;.7;.85;1', i),
                                rc: INDEFINITE
                            };
                        },
                        t: 1
                    }]
                };
            },
            t: 12
        }]
    };
    var spinners = {
        ios: IOS_SPINNER,
        'ios-small': IOS_SPINNER,
        bubbles: {
            sw: 0,
            c: [{
                fn: function (i) {
                    return {
                        cx: 24 * Math.cos(2 * Math.PI * i / 8),
                        cy: 24 * Math.sin(2 * Math.PI * i / 8),
                        t: TRANSLATE32,
                        a: [{
                            fn: function () {
                                return {
                                    an: 'r',
                                    dur: DURATION,
                                    v: animationValues('1;1.5;2;2.5;3;3.5;4;4.8', i),
                                    rc: INDEFINITE
                                };
                            },
                            t: 1
                        }]
                    };
                },
                t: 8
            }]
        },
        circles: {
            c: [{
                fn: function (i) {
                    return {
                        r: 5,
                        cx: 24 * Math.cos(2 * Math.PI * i / 8),
                        cy: 24 * Math.sin(2 * Math.PI * i / 8),
                        t: TRANSLATE32,
                        sw: 0,
                        a: [{
                            fn: function () {
                                return {
                                    an: 'fill-opacity',
                                    dur: DURATION,
                                    v: animationValues('.3;.3;.3;.4;.7;.85;.9;1', i),
                                    rc: INDEFINITE
                                };
                            },
                            t: 1
                        }]
                    };
                },
                t: 8
            }]
        },
        crescent: {
            c: [{
                sw: 4,
                da: 128,
                os: 82,
                r: 26,
                cx: 32,
                cy: 32,
                f: NONE,
                at: [SPIN_ANIMATION]
            }]
        },
        dots: {
            c: [{
                fn: function (i) {
                    return {
                        cx: 16 + (16 * i),
                        cy: 32,
                        sw: 0,
                        a: [{
                            fn: function () {
                                return {
                                    an: 'fill-opacity',
                                    dur: DURATION,
                                    v: animationValues('.5;.6;.8;1;.8;.6;.5', i),
                                    rc: INDEFINITE
                                };
                            },
                            t: 1
                        }, {
                            fn: function () {
                                return {
                                    an: 'r',
                                    dur: DURATION,
                                    v: animationValues('4;5;6;5;4;3;3', i),
                                    rc: INDEFINITE
                                };
                            },
                            t: 1
                        }]
                    };
                },
                t: 3
            }]
        },
        lines: {
            sw: 7,
            lc: ROUND,
            line: [{
                fn: function (i) {
                    return {
                        x1: 10 + (i * 14),
                        x2: 10 + (i * 14),
                        a: [{
                            fn: function () {
                                return {
                                    an: 'y1',
                                    dur: DURATION,
                                    v: animationValues('16;18;28;18;16', i),
                                    rc: INDEFINITE
                                };
                            },
                            t: 1
                        }, {
                            fn: function () {
                                return {
                                    an: 'y2',
                                    dur: DURATION,
                                    v: animationValues('48;44;36;46;48', i),
                                    rc: INDEFINITE
                                };
                            },
                            t: 1
                        }, {
                            fn: function () {
                                return {
                                    an: STROKE_OPACITY,
                                    dur: DURATION,
                                    v: animationValues('1;.8;.5;.4;1', i),
                                    rc: INDEFINITE
                                };
                            },
                            t: 1
                        }]
                    };
                },
                t: 4
            }]
        },
        ripple: {
            f: NONE,
            'fill-rule': 'evenodd',
            sw: 3,
            circle: [{
                fn: function (i) {
                    return {
                        cx: 32,
                        cy: 32,
                        a: [{
                            fn: function () {
                                return {
                                    an: 'r',
                                    begin: (i * -1) + 's',
                                    dur: '2s',
                                    v: '0;24',
                                    keyTimes: '0;1',
                                    keySplines: '0.1,0.2,0.3,1',
                                    calcMode: 'spline',
                                    rc: INDEFINITE
                                };
                            },
                            t: 1
                        }, {
                            fn: function () {
                                return {
                                    an: STROKE_OPACITY,
                                    begin: (i * -1) + 's',
                                    dur: '2s',
                                    v: '.2;1;.2;0',
                                    rc: INDEFINITE
                                };
                            },
                            t: 1
                        }]
                    };
                },
                t: 2
            }]
        },
        spiral: {
            defs: [{
                linearGradient: [{
                    id: 'sGD',
                    gradientUnits: 'userSpaceOnUse',
                    x1: 55,
                    y1: 46,
                    x2: 2,
                    y2: 46,
                    stop: [{
                        offset: 0.1,
                        class: 'stop1'
                    }, {
                        offset: 1,
                        class: 'stop2'
                    }]
                }]
            }],
            g: [{
                sw: 4,
                lc: ROUND,
                f: NONE,
                path: [{
                    stroke: 'url(#sGD)',
                    d: 'M4,32 c0,15,12,28,28,28c8,0,16-4,21-9'
                }, {
                    d: 'M60,32 C60,16,47.464,4,32,4S4,16,4,32'
                }],
                at: [SPIN_ANIMATION]
            }]
        }
    };

    function detect(ua) {
        var os = {}
        if (ua.match(/(Android);?[\s\/]+([\d.]+)?/)) { //android
            os.android = true;
            os.isBadAndroid = !(/Chrome\/\d/.test(window.navigator.appVersion));
        } else if (ua.match(/(iPhone\sOS)\s([\d_]+)/)) { //iphone
            os.ios = true;
        } else if (ua.match(/(iPad).*OS\s([\d_]+)/)) { //ipad
            os.ios = true;
        }
        this.os = os;
    };
    window.svgHelper = {
        spinners: spinners,
        createSvgElement: createSvgElement
    }
    detect.call(window.svgHelper, window.navigator.userAgent);
})(document, window);
