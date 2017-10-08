import webpack from 'webpack';
import path from 'path';
import ExtractTxtPlugin from 'extract-text-webpack-plugin';
const CleanWebpackPlugin = require('clean-webpack-plugin');

const infernoPath = path.resolve(__dirname, 'plugin/inferno/index.js');
const infernoSharedPath = path.resolve(__dirname, 'plugin/inferno-shared/index.js');

export default {
    cache: true,
    entry: {
        server: ['./server.js']
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
    module: {
        loaders: [
            {
                test: /\.(css|less)$/,
                loader: ExtractTxtPlugin.extract("style", "css!less", {publicPath: "/dist"})
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                include: __dirname,
                query: {
                    plugins: ['transform-runtime'],
                    presets: ['es2015', 'stage-0']
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
            }
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
                'NODE_ENV': JSON.stringify('production'),
                'PATH'    : "''"
            }
        }),
        new ExtractTxtPlugin("[name].css", {
            allChunks: true
        }),
        new CleanWebpackPlugin(['node_path/*'], {
            root: __dirname,
            dry: false
        })
        //new webpack.optimize.UglifyJsPlugin({
        //    compress: {warnings: false}
        //})
    ]
}