let win = window || {},
    requestAnimationFrame = win.requestAnimationFrame
        || win.webkitRequestAnimationFrame,
    cancelAnimationFrame = win.cancelAnimationFrame
        || win.webkitCancelRequestAnimationFrame,
    rafSupported = !!requestAnimationFrame;
const $$raf = rafSupported ? function (fn) {
    let id = requestAnimationFrame(fn);
    return function () {
        cancelAnimationFrame(id);
    };
} : function (fn) {
    let timer = win.setTimeout(fn, 16.666); // 1000 / 60 = 16.666
    return function () {
        win.clearTimeout(timer);
    };
};
$$raf.supported = rafSupported;
export default $$raf;