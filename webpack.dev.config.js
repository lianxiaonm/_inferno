const webpack = require('webpack');
const path = require('path');
const ExtractTxtPlugin = require('extract-text-webpack-plugin');
const htmlWebpackPlugin = require('html-webpack-plugin');

const infernoPath = path.resolve(__dirname, 'plugin/inferno/index.js');
const infernoSharedPath = path.resolve(__dirname, 'plugin/inferno-shared/index.js');
const node_modules = path.resolve(__dirname, 'node_modules');
//const infernoComponentPath = path.resolve(node_modules, 'inferno-component/index.js');
//const infernoCreateElementPath = path.resolve(node_modules, 'inferno-create-element/index.js');
//const infernoHyperscriptPath = path.resolve(node_modules, 'inferno-hyperscript/index.js');
//const infernoReduxPath = path.resolve(node_modules, 'inferno-redux/index.js');
//const reduxPath = path.resolve(node_modules, 'redux/lib/index.js');
//const historyPath = path.resolve(node_modules, 'history/lib/index.js');

//const lessExtractor = new ExtractTxtPlugin('*/[name].less', {allChunks: true});

module.exports = {
    entry: {
        vendor: [
            'inferno',
            'inferno-component',
            'inferno-shared',
            //'mobx',
            //'inferno-mobx',
            //'rsedux',
            //'redux-thunk',
            //'inferno-redux',
            'inferno-router',
            'history/createHashHistory'
        ],
        //framework: ['./plugin/common/framework.js'],
        app: ['./src/index.js'],
        plugin: [
            './plugin/ionic-svg.js',
            './plugin/mui-gesture.js',
            './plugin/mui-scroll.js',
            './plugin/picker.js'
        ]
    },
    output: {
        path: path.resolve(__dirname, 'deployed'),
        filename: '[name].js',
        chunkFilename: "[name].js",
        publicPath: '/deployed/'
    },
    resolve: {
        alias: {
            'inferno': infernoPath,
            'inferno-shared': infernoSharedPath,
            //'inferno-component': infernoComponentPath,
            //'inferno-create-element': infernoCreateElementPath,
            //'inferno-hyperscript': infernoHyperscriptPath,
            //'inferno-redux': infernoReduxPath,
            //'redux': reduxPath,
            //'history': historyPath,
            extensions: ['', '.js', '.jsx']
        }
    },
    module: {
        loaders: [ //2.0 loaders -> rules
            {
                test: /\.(css|less)$/,
                //loader: lessExtractor.extract(['css', 'less'])
                loader: ExtractTxtPlugin.extract("style", "css!less", {publicPath: "/deployed"})
                //loader:'style!css!less'
            }, //2.0 loader -> use
            {
                test: /\.(js|jsx)$/,
                loader: 'babel',
                exclude: /node_modules/,
                include: __dirname
            },
            {
                test: /\.(jpg|png|gif)$/,
                loader: 'url?limit=4000&name=/images/[name].[ext]'
            },
            {
                test: /\.(svg|ttf|woff|eot)$/,
                loader: 'url?limit=4000&name=/fonts/[name].[ext]'
            }
        ]
    },
    plugins: [
        new webpack.optimize.DedupePlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        //new webpack.DllReferencePlugin({
        //    context: __dirname,
        //    manifest: require('./dll/plugin-manifest.json'),
        //}),
        //new webpack.DllReferencePlugin({
        //    context: __dirname,
        //    manifest: require('./dll/vendor-manifest.json'),
        //}),
        //提取共有代码
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'vendor.js',
            chunks: ['vendor', 'app']
        }),
        //lessExtractor
        new ExtractTxtPlugin("[name].css", {
            allChunks: true
        }),
        //new htmlWebpackPlugin()
        new webpack.optimize.UglifyJsPlugin({
            compress: {warnings: false}
        })
    ]
}