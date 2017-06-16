import { noop } from './common'

let debug = true;

export function debugEnabled(flag) {
    return flag == null ? debug : debug = !!flag;
}

function formatError(arg) {
    if (arg instanceof Error) {
        if (arg.stack) {
            arg = (arg.message && arg.stack.indexOf(arg.message) === -1)
                ? 'Error: ' + arg.message + '\n' + arg.stack : arg.stack;
        } else if (arg.sourceURL) {
            arg = arg.message + '\n' + arg.sourceURL + ':' + arg.line;
        }
    }
    return arg;
}
function consoleLog(type) {
    var console = window.console || {},
        logFn = console[type] || console.log || noop;
    return !!logFn.apply ? function () {
        var args = [], i = 0, ii = arguments.length;
        for (; i < ii; i++) {
            args.push(formatError(arguments[i]));
        }
        return logFn.apply(console, args);
    } : function (arg1, arg2) {
        logFn(arg1, arg2 == null ? '' : arg2);
    };
}
const $log = {
    log: consoleLog('log'),
    info: consoleLog('info'),
    warn: consoleLog('warn'),
    error: consoleLog('error'),
    debug: (function () {
        var fn = consoleLog('debug');
        return function () {
            debug && fn.apply(self, arguments);
        };
    }())
}
export default $log;
export function $exceptionHandler() {
    $log.error.apply($log, arguments);
};