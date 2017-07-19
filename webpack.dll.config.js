const path    = require('path');
const webpack = require('webpack');

const infernoPath       = path.resolve(__dirname, 'plugin/inferno/index.js');
const infernoSharedPath = path.resolve(__dirname, 'plugin/inferno-shared/index.js');

module.exports = {
    entry  : {
        vendor: [
            'inferno',
            'inferno-component',
            'inferno-shared',
            'redux',
            'redux-thunk',
            'inferno-redux',
            'inferno-router',
            'history/createHashHistory'
        ],
        //framework: ['./plugin/common/framework.js'],
        plugin: [
            './plugin/ionic-svg.js',
            './plugin/mui-gesture.js',
            './plugin/mui-scroll.js',
            './plugin/picker.js'
        ]
    },
    output : {
        path    : path.join(__dirname, 'dll'),
        filename: '[name].dll.js',
        library : '[name]_library'
    },
    resolve: {
        alias: {
            'inferno'       : infernoPath,
            'inferno-shared': infernoSharedPath,
            extensions      : ['', '.js', '.jsx']
        }
    },
    module : {
        loaders: [ //2.0 loaders -> rules
            {
                test   : /\.(js|jsx)$/,
                loader : 'babel',
                exclude: /node_modules/,
                include: __dirname
            }
        ]
    },
    plugins: [
        new webpack.optimize.DedupePlugin(),
        new webpack.DllPlugin({
            path: path.join(__dirname, 'dll', '[name]-manifest.json'),
            name: '[name]_library'
        })
    ]
};