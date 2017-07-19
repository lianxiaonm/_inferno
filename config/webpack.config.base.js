function getBaseConfig(opts) {
    // 定义配置相关
    const appName           = opts['appName'];
    const isProd            = (process.env.NODE_ENV === 'production');
    const config            = isProd ? require('./metadata.webpack.config.prod') : require('./metadata.webpack.config.dev');
    // 定义路径相关
    const path              = require('path');
    const rootPath          = path.resolve(__dirname, '../');
    // 定义webpack相关
    const webpack           = require('webpack');
    const ExtractTextPlugin = require("extract-text-webpack-plugin");
    //定义模块相关路径
    const infernoPath       = path.join(rootPath, 'plugin/inferno/index.js');
    const infernoSharedPath = path.join(rootPath, 'plugin/inferno-shared/index.js');

    return {
        // 定义输出
        output : {
            filename     : '[name]/[name].[chunkHash:8].js',
            chunkFilename: `${appName}/[name].[chunkHash:8].js`
        },
        // 路径解析
        resolve: {
            alias: {
                'inferno'       : infernoPath,
                'inferno-shared': infernoSharedPath,
                extensions      : ['', '.js', '.jsx']// 默认模块后缀名优先级
            }
        },
        // source map
        //devtool: config.devtool,
        // 插件
        plugins: [
            new webpack.optimize.DedupePlugin(),
            // 环境定义
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: config.env.NODE_ENV
                }
            })
            //压缩 JS
            //new webpack.optimize.UglifyJsPlugin({
            //    sourceMap: !!config.sourceMap
            //})
        ]
    }
}
// 导出配置方法
module.exports = {
    getBaseConfig
}
