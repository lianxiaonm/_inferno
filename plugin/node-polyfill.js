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
document.body = document;
global.window = window;
global.document = document;
