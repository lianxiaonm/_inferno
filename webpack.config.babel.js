import webpack from 'webpack';
import fs from 'fs';
import path from 'path';
import ExtractTxtPlugin from 'extract-text-webpack-plugin';

let nodeModules = {};
fs.readdirSync('node_modules')
    .filter((x) => {
        return ['.bin'].indexOf(x) === -1;
    })
    .forEach((mod) => {
        nodeModules[mod] = 'commonjs ' + mod;
    });

const infernoPath = path.resolve(__dirname, 'plugin/inferno/index.js');
const infernoSharedPath = path.resolve(__dirname, 'plugin/inferno-shared/index.js');

export default {
    cache: true,
    entry: {
        /*vendor: [
            'inferno',
            'inferno-shared',
            //---------------------
            'inferno-component',
            'inferno-server',
            'redux',
            'redux-thunk',
            'inferno-redux',
            'inferno-router',
            'history/createHashHistory'
        ],*/
        server: ['./server.js'],
    },
    output: {
        path: path.resolve(__dirname, 'node_path'),
        filename: '[name].js',
        chunkFilename: "[name].js",
        publicPath: 'node_path/'
    },
    resolve: {
        alias: {
            'inferno': infernoPath,
            'inferno-shared': infernoSharedPath,
            extensions: ['', '.js', '.jsx']
        }
    },
    context: __dirname,
    node: {
        __filename: false,
        __dirname: false
    },
    target: 'node',
    //externals: nodeModules,
    module: {
        loaders: [
            {
                test: /\.(css|less)$/,
                //loader: lessExtractor.extract(['css', 'less'])
                loader: ExtractTxtPlugin.extract("style", "css!less", {publicPath: "/dist"})
                //loader:'style!css!less'
            }, //2.0 loader -> use
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                include: __dirname,
                query: {
                    plugins: ['transform-runtime'],
                    presets: ['es2015', 'stage-0'],
                }
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            },
            {
                test: /\.(jpg|png|gif)$/,
                loader: 'url?limit=4000&name=/images/[name].[ext]'
            },
            {
                test: /\.(svg|ttf|woff)$/,
                loader: 'url?limit=4000&name=/fonts/[name].[ext]'
            },
        ]
    },
    plugins: [
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'server',
            filename: 'server.js',
            chunks: ['server']
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new ExtractTxtPlugin("[name].css", {
            allChunks: true
        }),
        //new webpack.optimize.UglifyJsPlugin({
        //    compress: {warnings: false}
        //})
    ]
}