/**
 * 选择列表插件 varstion 2.0.0 by Houfeng
 */
(function (window, document, undefined) {
    var MAX_EXCEED = 20, VISIBLE_RANGE = 90, DEFAULT_ITEM_HEIGHT = 40,
        rad2deg = function (rad) {
            return rad / (Math.PI / 180);
        };
    var platform = navigator.platform.toLowerCase(),
        userAgent = navigator.userAgent.toLowerCase(),
        isIos = (userAgent.indexOf('iphone') > -1 ||
            userAgent.indexOf('ipad') > -1 ||
            userAgent.indexOf('ipod') > -1) &&
            (platform.indexOf('iphone') > -1 ||
            platform.indexOf('ipad') > -1 ||
            platform.indexOf('ipod') > -1);

    window.$Picker = function (holder) {
        var self = this;
        self.holder = holder;
        self.init();
        self.initParams();
        self.calcElItemPosition();
        self._initEvent();
    };
    window.$Picker.prototype = {
        findElItems: function () {
            return this.elItems = [].slice.call(this.holder.querySelectorAll('li'));
        },
        init: function () {
            var self = this,
                holder = self.holder, elItems = self.findElItems(),
                list = self.list = holder.querySelector('ul');
            self.d = self.height = holder.offsetHeight;
            self.r = self.d / 2;
            self.itemHeight = elItems.length ? elItems[0].offsetHeight : DEFAULT_ITEM_HEIGHT;
            self.itemAngle = parseInt(self.calcAngle(self.itemHeight * 0.8));
            self.hightlightRange = self.itemAngle / 2;
            self.visibleRange = VISIBLE_RANGE;
            list.angle = self.beginAngle = 0;
            self.beginExceed = -MAX_EXCEED;
            if (isIos) self.list.style.webkitTransformOrigin = "center center " + self.r + "px";
            self._events = {};
            var events = self.events = {},
                lastAngle = 0, startY = null, isPicking = false;
            events['touchstart'] = function (event) {
                event.stopPropagation();
                event.preventDefault();
                isPicking = true;
                list.style.webkitTransition = '';
                startY = (event.changedTouches ? event.changedTouches[0] : event).pageY;
                lastAngle = list.angle;
                self.updateParams(event, true);
            };
            events['touchcancel'] = events['touchend'] = function (event) {
                event.stopPropagation();
                isPicking = false, self.startScroll(event);
            };
            events['touchmove'] = function (event) {
                if (!isPicking) return;
                event.stopPropagation();
                var endY = (event.changedTouches ? event.changedTouches[0] : event).pageY,
                    dragRange = (endY - startY) / 1.3,
                    dragAngle = self.calcAngle(dragRange),
                    newAngle = dragRange > 0 ? lastAngle - dragAngle : lastAngle + dragAngle;
                newAngle = Math.max(Math.min(newAngle, self.endExceed), self.beginExceed);
                self.setAngle(newAngle), self.updateParams(event);
            };
        },
        reLayout: function (idx) {
            this.findElItems(), this.calcElItemPosition();
            idx == null ? this.endScroll() : this.setIdx(idx);
        },
        calcElItemPosition: function () {
            var self = this;
            self.elItems.forEach(function (item, idx) {
                var angle = item.angle = self.endAngle = self.itemAngle * idx;
                item.style.webkitTransformOrigin = "center center -" + self.r + "px";
                item.style.webkitTransform = "translateZ(" + self.r + "px) rotateX(" + (-angle) + "deg)";
            });
            self.endExceed = self.endAngle + MAX_EXCEED;
            self.calcElItemVisibility(self.beginAngle);
        },
        calcAngle: function (c) {
            c = Math.abs(c);//只算角度不关心正否值
            var a = parseFloat(this.r), b = a,
                intDeg = parseInt(c / this.d) * 180;
            c = c % this.d;
            var cosC = (a * a + b * b - c * c) / (2 * a * b),
                angleC = intDeg + rad2deg(Math.acos(cosC));
            return angleC;
        },
        calcElItemVisibility: function (angle) {
            var self = this;
            self.elItems.forEach(function (item) {
                var diff = Math.abs(item.angle - angle);
                if (diff < self.hightlightRange) {
                    item.classList.add('highlight');
                } else if (diff < self.visibleRange) {
                    item.classList.add('visible');
                    item.classList.remove('highlight');
                } else {
                    item.classList.remove('highlight');
                    item.classList.remove('visible');
                }
            });
        },
        setAngle: function (angle) {
            this.list.angle = angle;
            this.list.style.webkitTransform = "perspective(1000px) rotateY(0) rotateX(" + angle + "deg)";
            this.calcElItemVisibility(angle);
        },
        _initEvent: function (remove) {
            var eventType = remove ? 'removeEventListener' : 'addEventListener',
                holder = this.holder, events = this.events;
            for (var evName in events) {
                holder[eventType](evName, events[evName], false);
            }
        },
        initParams: function () {
            this.stopInertiaMove = this.lastMoveStart = this.lastMoveTime = 0;
        },
        updateParams: function (event, isStart) {
            var self = this,
                point = event.changedTouches ? event.changedTouches[0] : event,
                nowTime = event.timeStamp || Date.now();
            if (isStart) {
                self.lastMoveStart = point.pageY;
                self.lastMoveTime = nowTime;
                self.startAngle = self.list.angle;
            } else {
                if (nowTime - self.lastMoveTime > 300) {
                    self.lastMoveTime = nowTime;
                    self.lastMoveStart = point.pageY;
                }
            }
            self.stopInertiaMove = true;
        },
        startScroll: function (event) {
            var self = this,
                point = event.changedTouches ? event.changedTouches[0] : event,
                nowTime = event.timeStamp || Date.now(),
                v = (point.pageY - self.lastMoveStart) / (nowTime - self.lastMoveTime), //最后一段时间手指划动速度
                dir = v > 0 ? -1 : 1, //加速度方向
                deceleration = dir * 0.001,
                duration = Math.abs(v / deceleration), // 速度消减至0所需时间
                dist = v * duration / 6, //最终移动多少
                startAngle = self.list.angle,
                distAngle = self.calcAngle(dist) * dir,
                srcDistAngle = distAngle;
            if (startAngle + distAngle < self.beginExceed) {
                distAngle = self.beginExceed - startAngle;
                duration = duration * (distAngle / srcDistAngle) * 0.6;
            }
            if (startAngle + distAngle > self.endExceed) {
                distAngle = self.endExceed - startAngle;
                duration = duration * (distAngle / srcDistAngle) * 0.6;
            }
            distAngle ? self.scrollDistAngle(nowTime, startAngle, distAngle, duration) : self.endScroll();
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
                typeof _ev == 'function' && _ev.apply(self, args);
            });
        },
        scrollDistAngle: function (nowTime, startAngle, distAngle, duration) {
            var self = this, frameInterval = 8, stepCount = duration / frameInterval, stepIndex = 0;
            self.stopInertiaMove = false;
            (function inertiaMove() {
                if (self.stopInertiaMove) return;
                var newAngle = self.quartEaseOut(stepIndex, startAngle, distAngle, stepCount);
                self.setAngle(newAngle), stepIndex++;
                if (stepIndex > stepCount - 1 || newAngle < self.beginExceed ||
                    newAngle > self.endExceed) return self.endScroll();
                setTimeout(inertiaMove, frameInterval);
            })();
        },
        quartEaseOut: function (t, b, c, d) {
            return -c * ((t = t / d - 1) * t * t * t - 1) + b;
        },
        endScroll: function (noAni) {
            var self = this,
                angle = self.list.angle,
                _angle = self.correctAngle(angle);
            self.list.style.webkitTransition = (angle == _angle ? noAni ? 0 : 150 : 300) + "ms linear";
            self.setAngle(angle == _angle ? self.itemAngle * self.getIdx() : _angle);
            self._execEvent('change');
        },
        correctAngle: function (angle) {
            return angle < this.beginAngle ? this.beginAngle :
                angle > this.endAngle ? this.endAngle : angle;
        },
        getIdx: function () {
            return parseInt((this.list.angle / this.itemAngle).toFixed(0));
        },
        setIdx: function (index) {
            this.list.angle = this.itemAngle * index, this.endScroll(true);
        },
        destroy: function () {
            this._initEvent(false), this._events = {};
        }
    }
})(window, document);