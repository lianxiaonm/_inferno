/**
 * webpack config for SPA
 */
// 动态生成 spa webpack 配置数据
function getConfig(opts) {
    // 定义配置相关
    const utils              = require('./utils');
    const appName            = opts['appName'];
    const currEnvName        = opts['currEnvName'];
    const isProd             = (process.env.NODE_ENV === 'production');
    const config             = isProd ? require('./metadata.webpack.config.prod') : require('./metadata.webpack.config.dev');
    // 定义路径相关
    const path               = require('path');
    const rootPath           = path.resolve(__dirname, '../');
    const srcPath            = path.join(rootPath, `${appName}/`);
    const appType            = 'spa';
    const deployPath         = path.join(config.deployPath, appType);
    const publicPath         = isProd ? utils.getPrdPublicPath({currEnvName, appType, appName}) : config.publicPath.spa;
    // 定义webpack相关
    const webpack            = require('webpack');
    const webpackBaseConfig  = require('./webpack.config.base').getBaseConfig(opts);
    const merge              = require('webpack-merge');
    const HtmlWebpackPlugin  = require('html-webpack-plugin');
    const ExtractTextPlugin  = require("extract-text-webpack-plugin");
    const CleanWebpackPlugin = require('clean-webpack-plugin');
    const ZipWebpackPlugin   = require('webpack-zip-plugin');
    // 打印配置信息日志，用于排查错误
    var log                  = utils.log;
    log('---config----', config);
    log('---rootPath---', rootPath);
    log('---srcPath---', srcPath);
    log('---publicPath---', publicPath);
    log('---appName---', appName);

    // webpack
    return merge(webpackBaseConfig, {
        // 定义应用入口
        entry  : {
            [appName]: path.join(srcPath, 'index.js'),                       // 应用级
            framework: [
                path.join(rootPath, 'plugin/common/framework.js')   // 框架级 JS 和 CSS
            ],
            plugin   : [
                path.join(rootPath, 'plugin/ionic-svg.js'),
                path.join(rootPath, 'plugin/mui-gesture.js'),
                path.join(rootPath, 'plugin/mui-scroll.js'),
                path.join(rootPath, 'plugin/picker.js')
            ],
            adaptive : path.join(rootPath, 'plugin/adaptive.js')
        },
        // 定义输出
        output : {
            path      : deployPath,
            publicPath: publicPath
        }
        ,
        // 模块加载器规则
        module : {
            loaders: [ //2.0 loaders -> rules
                {
                    test  : /\.(css|less)$/,
                    loader: ExtractTextPlugin.extract("style", "css!less", {
                        publicPath: '../'
                    })
                },
                {
                    test   : /\.(js|jsx)$/,
                    loader : 'babel',
                    exclude: /node_modules/
                },
                {
                    test  : /\.(jpg|png|gif)$/,
                    loader: `url?limit=4000&name=images/[name].[ext]`
                },
                {
                    test  : /\.(svg|ttf|woff|eot)$/,
                    loader: `url?limit=4000&name=fonts/[name].[ext]`
                }
            ]
        },
        // 插件
        plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    'NODE_ENV': JSON.stringify(isProd ? 'production' : 'development'),
                    'PATH'    : JSON.stringify(appName)
                }
            }),
            // 公用模块提取
            new webpack.optimize.CommonsChunkPlugin({
                name: ["framework", "manifest"] // "manifest" 为提取运行期代码，确保公用文件缓存
            }),
            // 入口页面自动生成
            new HtmlWebpackPlugin({
                template      : path.join(rootPath, 'template.html'),
                filename      : `${appName}/index.html`,
                inject        : 'body',
                chunksSortMode: function (chunk1, chunk2) {
                    var order  = ['manifest', 'adaptive', 'plugin', 'framework', appName];
                    var order1 = order.indexOf(chunk1.names[0]);
                    var order2 = order.indexOf(chunk2.names[0]);
                    return order1 - order2;
                }
            }),
            // 分离框架级别 css 文件
            new ExtractTextPlugin("[name]/[name].[chunkHash:8].css", {
                allChunks: true
            }),
            new CleanWebpackPlugin([`${deployPath}/*`], {
                root: __dirname,
                dry : false
            })
        ].concat(
            isProd ? [
                // 打出 ZIP 包
                new ZipWebpackPlugin({
                    initialFile: deployPath,
                    endPath    : '../',
                    zipName    : `h5-spa.${appName}.zip`
                })
            ] : []
        )
    })
}

// 导出配置方法
module.exports = {
    getConfig
}

