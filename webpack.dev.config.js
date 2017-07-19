const webpack            = require('webpack');
const path               = require('path');
const ExtractTxtPlugin   = require('extract-text-webpack-plugin');
const htmlWebpackPlugin  = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ZipWebpackPlugin   = require('webpack-zip-plugin');

const infernoPath       = path.resolve(__dirname, 'plugin/inferno/index.js');
const infernoSharedPath = path.resolve(__dirname, 'plugin/inferno-shared/index.js');
const node_modules      = path.resolve(__dirname, 'node_modules');

const deployPath = path.resolve(__dirname, 'deployed');

module.exports = {
    entry  : {
        vendor: [
            './plugin/common/framework.js'
        ],
        app   : ['./src/index.js'],
        plugin: [
            './plugin/ionic-svg.js',
            './plugin/mui-gesture.js',
            './plugin/mui-scroll.js',
            './plugin/picker.js'
        ]
    },
    output : {
        path         : deployPath,
        filename     : '[name]/[name].[chunkHash:8].js',
        chunkFilename: "[name].[chunkHash:8].js",
        publicPath   : '/deployed/'
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
                test  : /\.(css|less)$/,
                //loader: lessExtractor.extract(['css', 'less'])
                loader: ExtractTxtPlugin.extract("style", "css!less", {publicPath: "/deployed"})
                //loader:'style!css!less'
            }, //2.0 loader -> use
            {
                test   : /\.(js|jsx)$/,
                loader : 'babel',
                exclude: /node_modules/
            },
            {
                test  : /\.(jpg|png|gif)$/,
                loader: 'url?limit=4000&name=/images/[name].[ext]'
            },
            {
                test  : /\.(svg|ttf|woff|eot)$/,
                loader: 'url?limit=4000&name=/fonts/[name].[ext]'
            }
        ]
    },
    //devtool: '#eval-source-map',
    plugins: [
        new webpack.optimize.DedupePlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production'),
                'PATH'    : "''"
            }
        }),
        //提取共有代码
        new webpack.optimize.CommonsChunkPlugin({
            name: ['vendor', 'manifest']
        }),
        //lessExtractor
        new ExtractTxtPlugin("[name].[chunkHash:8].css", {
            allChunks: true
        }),
        new htmlWebpackPlugin({
            template: './template.html',
            filename: '../index.html',
            inject  : 'body'
        }),
        //new webpack.optimize.UglifyJsPlugin({
        //    compress: {warnings: false}
        //}),
        //new ZipWebpackPlugin({
        //    initialFile: './deployed',
        //    endPath    : './build_path',
        //    zipName    : 'client.zip'
        //}),
        new CleanWebpackPlugin(['deployed/*'], {
            root: __dirname,
            dry : false
        })
    ]
}