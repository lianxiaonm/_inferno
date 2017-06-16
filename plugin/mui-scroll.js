//require mui-gesture
(function (window, Math, Class, undefined) {
    var EVENT_START = 'touchstart',
        EVENT_MOVE = 'touchmove',
        EVENT_END = 'touchend',
        EVENT_CANCEL = 'touchcancel';
    var _setTimeout = setTimeout,
        _clearTimeout = clearTimeout,
        _parseFloat = parseFloat;
    var ROUND = Math.round,
        ABS = Math.abs;

    function stopPropagation(e) {
        e.stopPropagation()
    }

    var session = Class.session,
        trigger = Class.trigger,
        _extend = Class._extend,
        getStyles = Class.getStyles,
        parseTranslateMatrix = Class.parseTranslateMatrix,
        quadratic = {style: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'},
        circular = {style: 'cubic-bezier(0.1, 0.57, 0.1, 1)'},
        //circular = {style: 'cubic-bezier(0.22, 0.61, 0.35, 1)'},
        outCirc = {style: 'cubic-bezier(0.075, 0.82, 0.165, 1)'},
        //outCubic = {style: 'cubic-bezier(0.165, 0.84, 0.44, 1)'},
        outCubic = {style: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'};
    var lockThreshold = 5;
    window.IScroll = Class.extend({
        init: function (element, options) {
            var self = this,
                scroller = self.scroller = element.children[0];
            self.wrapper = self.element = element;
            self.scrollerStyle = scroller && scroller.style;
            self.stopped = false, self._events = {};
            options = self.options = _extend({
                scrollY: true,      //是否竖向滚动
                scrollX: false,     //是否横向滚动
                startX: 0,          //初始化时滚动至x
                startY: 0,          //初始化时滚动至y
                preventDefaultException: {
                    tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|VIDEO)$/
                },
                momentum: true,
                bounce: true,       //是否启用回弹
                bounceTime: 500,    //回弹动画时间
                bounceEasing: outCirc, //回弹动画曲线
                scrollTime: 400,
                snap: 0.5,          //卡片切换距离(以当前容器宽度为基准)
                scrollEasing: outCubic, //轮播动画曲线
                resizePolling: 0,
                deceleration: undefined
            }, options);
            self.x = self.y = 0, self._initEvent();
            if (scroller) {
                self.refresh();
                self.scrollTo(options.startX, options.startY, 1);
            }
        },
        _initEvent: function (detach) {
            var self = this,
                action = detach ? 'removeEventListener' : 'addEventListener',
                wrapper = self.wrapper;
            window[action]('orientationchange', self);
            window[action]('resize', self);
            self.scroller[action]('webkitTransitionEnd', self);
            wrapper[action](EVENT_START, self);
            wrapper[action](EVENT_MOVE, self);
            wrapper[action](EVENT_CANCEL, self);
            wrapper[action](EVENT_END, self);
            wrapper[action]('drag', self);
            wrapper[action]('dragend', self);
            wrapper[action]('flick', self);
            wrapper[action]('scrollend', self);
        },
        handleEvent: function (e) {
            if (this.hold) return;
            var self = this, type = self.stopped ? 'reset' : e.type;
            this._execEvent(type, this);
            switch (type) {
                case EVENT_START:
                    return self._start(e);
                case EVENT_MOVE:
                    return e.preventDefault();
                case 'drag':
                case 'dragend':
                case 'flick':
                    return type === 'drag' ? self._drag(e) : self._flick(e);
                case EVENT_CANCEL:
                case EVENT_END:
                    return self._end(e);
                    break;
                case 'webkitTransitionEnd':
                    _clearTimeout(self.transitionTimer);
                    return self._transitionEnd(e);
                case 'scrollend':
                    return self._scrollend(e);
                case 'orientationchange':
                case 'resize':
                    return self._resize();
                case 'reset':
                    return self.resetPosition();
            }
        },
        toggleEvent: function (type, fn, remove) {
            var _evList = this._events[type] || (this._events[type] = []), index;
            if (remove) {
                index = _evList.indexOf(fn);
                index > -1 && _evList.splice(index, 1)
            } else _evList.push(fn);
        },
        _execEvent: function (type) {
            var self = this,
                args = [].slice.call(arguments, 1),
                _evList = self._events[type] || [];
            _evList.forEach(function (_ev) {
                typeof _ev == 'function' && _ev.apply(_ev, args);
            });
        },
        _start: function (e) {
            var self = this,
                scroller = self.scroller;
            self.moved = false;
            self._transitionTime();
            if (self.isInTransition) {
                self.isInTransition = false;
                var pos = parseTranslateMatrix(getStyles(scroller, 'webkitTransform')),
                    minX = ROUND(self.maxX),
                    minY = ROUND(self.maxY),
                    x = ROUND(pos.x),
                    y = ROUND(pos.y);
                if (x >= minX && x <= 0 && y >= minY && y <= 0)
                    self.setTranslate(x, y);
                trigger(scroller, 'scrollend', self);
                e.preventDefault();
            }
            self.reLayout();
            trigger(scroller, 'beforescrollstart', self);
        },
        _drag: function (e) {
            var self = this,
                detail = e.detail,
                options = self.options,
                directionTpl = detail.direction;
            var isPreventDefault = false, isReturn = false, _moved = self.moved,
                dir = (directionTpl === 'left' || directionTpl === 'right') ? ['X', 'Y'] :
                    (directionTpl === 'up' || directionTpl === 'down') ? ['Y', 'X'] : '';
            if (dir) {
                if (options['scroll' + dir[0]]) {
                    isPreventDefault = true;
                    if (!_moved) { //识别角度(该角度导致轮播不灵敏)
                        session.lockDirection = true; //锁定方向
                        session.startDirection = directionTpl;
                    }
                } else if (options['scroll' + dir[1]] && !_moved) {
                    isReturn = true;
                }
            } else isReturn = true;
            if (_moved || isPreventDefault) {
                stopPropagation(e);//阻止冒泡(scroll类嵌套)
                e.preventDefault();
                //detail.gesture && detail.gesture.preventDefault();
            }
            if (isReturn) return; //禁止非法方向滚动
            //move期间阻止冒泡(scroll嵌套)
            _moved ? stopPropagation(e) : trigger(self.scroller, 'scrollstart', self);
            var deltaX = detail.deltaX - (_moved ? session.prevTouch.deltaX : 0),
                deltaY = detail.deltaY - (_moved ? session.prevTouch.deltaY : 0),
                absDeltaX = ABS(detail.deltaX),
                absDeltaY = ABS(detail.deltaY);
            if (absDeltaX > absDeltaY + lockThreshold) deltaY = 0;
            else if (absDeltaY >= absDeltaX + lockThreshold) deltaX = 0;
            deltaX = self.hScroll ? deltaX : 0;
            deltaY = self.vScroll ? deltaY : 0;
            var posX = self.x,
                posY = self.y,
                newX = posX + deltaX,
                newY = posY + deltaY,
                _maxY = self.maxY,
                _maxX = self.maxX,
                _posX, _posY;
            if (newX > 0 || newX < _maxX) {
                _posX = newX > 0 ? newX : _maxX - newX;
                _posX = 3 + ~~(_posX * _posX / 1000);
                newX = options.bounce ? posX + deltaX / _posX : newX > 0 ? 0 : _maxX;
            }
            if (newY > 0 || newY < _maxY) {
                _posY = newY > 0 ? newY : _maxY - newY;
                _posY = 3 + ~~(_posY * _posY / 1000);
                newY = options.bounce ? posY + deltaY / _posY : newY > 0 ? 0 : _maxY;
            }
            self.animationTimer || self._updateTranslate();        //TODO
            self.direction = detail.deltaX > 0 ? 'right' : 'left';
            self.moved = true, self.x = newX, self.y = newY;
            trigger(self.scroller, 'scroll', self);
        },
        _flick: function (e) {
            if (!this.moved || this.hold) return;
            stopPropagation(e);
            var self = this, detail = e.detail;
            self._clearAnimation();
            if (e.type === 'dragend' && detail.flick) return;//dragend
            var newX = ROUND(self.x),
                newY = ROUND(self.y),
                options = self.options;
            self.isInTransition = false;
            // reset if we are outside of the boundaries
            if (self.resetPosition(options.bounceTime)) return;
            self.scrollTo(newX, newY); // ensures that the last position is rounded
            if (e.type === 'dragend') { //dragend
                return trigger(self.scroller, 'scrollend', self);
            }
            var time = 0, easing = '', _x = self.x, _y = self.y,
                _flickTime = detail.flickTime;
            // start momentum animation if needed
            if (options.momentum && _flickTime < 300) {
                var momentumX = !self.hScroll ? {
                    destination: newX, duration: 0
                } : self._momentum(_x, detail.flickX, _flickTime, self.maxX,
                    options.bounce ? self.wrapperWidth : 0, options.deceleration);
                var momentumY = !self.vScroll ? {
                    destination: newY, duration: 0
                } : self._momentum(_y, detail.flickY, _flickTime, self.maxY,
                    options.bounce ? self.wrapperHeight : 0, options.deceleration);
                newX = momentumX.destination;
                newY = momentumY.destination;
                time = Math.max(momentumX.duration, momentumY.duration);
                self.isInTransition = true;
            }
            if (newX != _x || newY != _y) {
                if (newX > 0 || newX < self.maxX || newY > 0 || newY < self.maxY)
                    easing = quadratic;
                return self.scrollTo(newX, newY, time, easing);
            }
            trigger(self.scroller, 'scrollend', self);
        },
        _end: function (e) {
            e.type === EVENT_CANCEL && this.resetPosition();
        },
        _transitionEnd: function (e) {
            var self = this, scroller = self.scroller;
            if (e.target == scroller || self.isInTransition) {
                self._transitionTime();
                if (!self.resetPosition(self.options.bounceTime)) {
                    self.isInTransition = false;
                    trigger(scroller, 'scrollend', self);
                }
            }
        },
        _scrollend: function () {
            if (ABS(this.y) > 0 && this.y <= this.maxY)
                trigger(this.scroller, 'scrollbottom', this);
        },
        _resize: function () {
            var self = this;
            _clearTimeout(self.resizeTimeout);
            self.resizeTimeout = _setTimeout(function () {
                self.refresh();
            }, self.options.resizePolling);
        },
        _transitionTime: function (time) {
            var self = this;
            self.scrollerStyle.webkitTransitionDuration = (time || 0) + 'ms';
            _clearTimeout(self.transitionTimer);
            //自定义timer，保证webkitTransitionEnd始终触发
            self.transitionTimer = time ? _setTimeout(function () {
                trigger(self.scroller, 'webkitTransitionEnd');
            }, time + 50) : null;
        },
        _clearAnimation: function () {
            _clearTimeout(this.animationTimer);
            this.animationTimer = null;
        },
        _updateTranslate: function () {
            var self = this;
            if (self.x !== self.lastX || self.y !== self.lastY) {
                self.scrollerStyle.webkitTransitionTimingFunction = circular.style;
                self.setTranslate(self.x, self.y);
            }
            self.animationTimer = _setTimeout(function () {
                self._updateTranslate();
            }, 10);
        },
        _reLayout: function () {
            var self = this;
            if (!self.hScroll) {
                self.maxX = 0;
                self.scrollerWidth = self.wrapperWidth;
                //self.scrollerStyle.height = Math.abs(self.maxY) + 'px';
            }
            if (!self.vScroll) {
                self.maxY = 0;
                self.scrollerHeight = self.wrapperHeight;
                //self.scrollerStyle.width = Math.abs(self.maxX) + 'px';
            }
        },
        _momentum: function (current, distance, time, lowerMargin, wrapperSize, deceleration) {
            var speed = _parseFloat(ABS(distance) / time),
                destination, duration;
            deceleration = deceleration == undefined ? 0.002 : deceleration;
            destination = current + speed * (speed < 1 ? speed : speed) / deceleration * (distance < 0 ? -1 : 1);
            duration = speed / deceleration;
            if (destination < lowerMargin) {
                destination = wrapperSize ? lowerMargin - (wrapperSize / 4 * (speed / 8)) : lowerMargin;
                distance = ABS(destination - current);
                duration = distance / speed;
            } else if (destination > 0) {
                destination = wrapperSize ? wrapperSize / 4 * (speed / 8) : 0;
                distance = ABS(current) + destination;
                duration = distance / speed;
            }
            return {destination: ROUND(destination), duration: duration};
        },
        //--------------API-----------------
        setStopped: function (stopped) {
            this.stopped = !!stopped;
        },
        setTranslate: function (x, y) {
            var self = this;
            self.x = self.lastX = x, self.y = self.lastY = y;
            self.scrollerStyle.webkitTransform = 'translate3d(' + x + 'px,' + y + 'px,0) translateZ(0)';
            trigger(self.scroller, 'scroll', self);
        },
        reLayout: function () {
            var self = this,
                wrapper = self.wrapper,
                paddingLeft = _parseFloat(getStyles(wrapper, 'padding-left')) || 0,
                paddingRight = _parseFloat(getStyles(wrapper, 'padding-right')) || 0,
                paddingTop = _parseFloat(getStyles(wrapper, 'padding-top')) || 0,
                paddingBottom = _parseFloat(getStyles(wrapper, 'padding-bottom')) || 0,
                clientWidth = wrapper.clientWidth,
                clientHeight = wrapper.clientHeight;
            self.scrollerWidth = self.scroller.offsetWidth;
            self.scrollerHeight = self.scroller.offsetHeight;
            self.wrapperWidth = clientWidth - paddingLeft - paddingRight;
            self.wrapperHeight = clientHeight - paddingTop - paddingBottom;
            self.maxX = Math.min(self.wrapperWidth - self.scrollerWidth, 0);
            self.maxY = Math.min(self.wrapperHeight - self.scrollerHeight, 0);
            self.hScroll = self.options.scrollX;
            self.vScroll = self.options.scrollY;
            self._reLayout();
        },
        resetPosition: function (time) {
            var self = this, x = self.x, y = self.y;
            self.hold = false;
            if (!self.hScroll || x > 0) x = 0;
            else if (x < self.maxX) x = self.maxX;
            if (!self.vScroll || y > 0) y = 0;
            else if (y < self.maxY) y = self.maxY;
            if (x == self.x && y == self.y) return false;
            self.scrollTo(x, y, time || 0, self.options.scrollEasing);
            return true;
        },
        refresh: function () {
            this.reLayout(), this.hold = false;
            trigger(this.scroller, 'refresh', this);
            this.resetPosition();
        },
        scrollTo: function (x, y, time, easing) {
            var self = this,
                easing = easing || circular;
            self.isInTransition = time > 0;
            if (self.isInTransition) {
                self._clearAnimation();
                self.scrollerStyle.webkitTransitionTimingFunction = easing.style;
                self._transitionTime(time);
            }
            self.setTranslate(x, y);
        },
        scrollToBottom: function (time, easing) {
            this.scrollTo(0, this.maxY, time || this.options.scrollTime, easing);
        },
        destroy: function () {
            this._initEvent(true), this._events = {}; //detach
        }
    })
})(window || {}, Math, window.Class);
