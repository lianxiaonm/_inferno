import { isFunction, throwError, isObject, isArray } from 'inferno-shared'

import { isPromiseLike, forEach } from './common'

import { $exceptionHandler } from './log'

function callOnce(self, resolveFn, rejectFn) {
    var called = 0;

    function wrap(fn) {
        return function (value) {
            called || called++ || fn.call(self, value);
        };
    }

    return [wrap(resolveFn), wrap(rejectFn)];
}
var defer = function () {
    return new Deferred();
};
function Promise() {
    this.$$state = {status: 0};
}
Promise.prototype = {
    then: function (onFulfilled, onRejected, progressBack) {
        let result = new Deferred(),
            $$state = this.$$state;
        $$state.pending || ($$state.pending = []);
        $$state.pending.push([result, onFulfilled, onRejected, progressBack]);
        $$state.status > 0 && scheduleProcessQueue($$state);
        return result.promise;
    },
    "catch": function (callback) {
        return this.then(null, callback);
    },
    "finally": function (callback, progressBack) {
        return this.then(function (value) {
            return handleCallback(value, true, callback);
        }, function (error) {
            return handleCallback(error, false, callback);
        }, progressBack);
    }
};
function simpleBind(context, fn) {
    return function (value) {
        fn.call(context, value);
    };
}

function processQueue(state) {
    var fn, promise, pending = state.pending;
    state.processScheduled = false;
    state.pending = undefined;
    for (var i = 0, ii = pending.length; i < ii; ++i) {
        promise = pending[i][0];
        fn = pending[i][state.status];
        try {
            isFunction(fn) ? promise.resolve(fn(state.value)) :
                promise[state.status === 1 ? 'resolve' : 'reject'](state.value);
        } catch (e) {
            promise.reject(e), $exceptionHandler(e);
        }
    }
}

function scheduleProcessQueue(state) {
    if (state.processScheduled || !state.pending) return;
    state.processScheduled = true, processQueue(state)
}

function Deferred() {
    this.promise = new Promise();
    this.resolve = simpleBind(this, this.resolve);
    this.reject = simpleBind(this, this.reject);
    this.notify = simpleBind(this, this.notify);
}

Deferred.prototype = {
    resolve: function (val) {
        if (this.promise.$$state.status) return;
        if (val === this.promise) {
            this.$$reject(new Error("Expected promise to be resolved with value other than itself " + val));
        } else this.$$resolve(val);
    },
    $$resolve: function (val) {
        var then, fns, self = this,
            $$state = self.promise.$$state;
        fns = callOnce(self, self.$$resolve, self.$$reject);
        try {
            if (isObject(val) || isFunction(val)) then = val && val.then;
            if (isFunction(then)) {
                $$state.status = -1;
                then.call(val, fns[0], fns[1], self.notify);
            } else {
                $$state.value = val, $$state.status = 1;
                scheduleProcessQueue($$state);
            }
        } catch (e) {
            fns[1](e), $exceptionHandler(e);
        }
    },
    reject: function (reason) {
        this.promise.$$state.status || this.$$reject(reason);
    },
    $$reject: function (reason) {
        this.promise.$$state.value = reason;
        this.promise.$$state.status = 2;
        scheduleProcessQueue(this.promise.$$state);
    },
    notify: function (progress) {
        var callbacks = this.promise.$$state.pending || [];
        this.promise.$$state.status <= 0 && callbacks.length && (function () {
            var callback, result;
            for (var i = 0, ii = callbacks.length; i < ii; i++) {
                result = callbacks[i][0];
                callback = callbacks[i][3];
                try {
                    result.notify(isFunction(callback) ? callback(progress) : progress);
                } catch (e) {
                    $exceptionHandler(e);
                }
            }
        })();
    }
};
var reject = function (reason) {
    var result = new Deferred();
    result.reject(reason);
    return result.promise;
};
var makePromise = function (value, resolved) {
    var result = new Deferred();
    result[resolved ? 'resolve' : 'reject'](value);
    return result.promise;
};
var handleCallback = function (value, isResolved, callback) {
    var callbackOutput = null;
    try {
        if (isFunction(callback)) callbackOutput = callback();
    } catch (e) {
        return makePromise(e, false);
    }
    if (isPromiseLike(callbackOutput)) {
        return callbackOutput.then(function () {
            return makePromise(value, isResolved);
        }, function (error) {
            return makePromise(error, false);
        });
    } else {
        return makePromise(value, isResolved);
    }
};
var when = function (value, callback, errback, progressBack) {
    var result = new Deferred();
    result.resolve(value);
    return result.promise.then(callback, errback, progressBack);
};

function all(promises) {
    var deferred = new Deferred(),
        counter = 0,
        results = isArray(promises) ? [] : {};
    forEach(promises, function (promise, key) {
        counter++;
        when(promise).then(function (value) {
            if (results.hasOwnProperty(key)) return;
            results[key] = value;
            if (!(--counter)) deferred.resolve(results);
        }, function (reason) {
            results.hasOwnProperty(key) || deferred.reject(reason);
        });
    });
    counter === 0 && deferred.resolve(results);
    return deferred.promise;
}
const $q = function Q(resolver) {
    if (!isFunction(resolver))
        throwError("Expected resolverFn, got " + resolver);
    if (!(this instanceof Q))
        return new Q(resolver);
    var deferred = new Deferred();
    resolver(function (value) {
        deferred.resolve(value);
    }, function (reason) {
        deferred.reject(reason);
    });
    return deferred.promise;
};
$q.defer = defer;
$q.reject = reject;
$q.when = when;
$q.all = all;
export default $q;