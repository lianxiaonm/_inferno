var window = {
    navigator: {},
    location: {}
}
var document = {
    createElement(){
        return {
            setAttribute(){},
            pathname: ''
        }
    },
    appendChild(){}
};
var yqbNative = {
    getAppVersion(){return '0.0.0'},
    compareVer(){return false;}
};
document.body = document;
global.window = window;
global.document = document;
global.yqbNative = yqbNative;
