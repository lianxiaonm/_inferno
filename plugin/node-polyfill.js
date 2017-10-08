var location           = {},
    navigator          = {},
    window             = {},
    document           = {},
    yqbNative          = {};
window.navigator       = navigator;
window.location        = location;
window.document        = document;
window.yqbNative       = yqbNative;
//
navigator.userAgent    = '';
//
document.createElement = () => {
    return {
        setAttribute(){},
        pathname: ''
    }
}
document.appendChild   = () => {};
document.body          = document;

yqbNative.getAppVersion = () => '0.0.0'
yqbNative.compareVer    = () => false;

//
global.window    = window;
global.location  = location;
global.navigator = navigator;
global.document  = document;
global.yqbNative = yqbNative;
