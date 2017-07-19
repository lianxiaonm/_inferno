/**
 * 开发及测试环境配置信息
 * @Author: xujia
 */
const path     = require('path')
const rootPath = path.resolve(__dirname, '../')
var base       = require('./metadata.webpack.config.base');
var merge      = require('webpack-merge');
var utils      = require('./utils');

module.exports = merge(base, {
    env            : {
        NODE_ENV: '"development"'
    },
    gZip           : true,
    autoOpenBrowser: true,
    sourceMap      : true,
    devtool        : '#source-map',
    isHotReload    : true,
    deployPath     : path.join(rootPath, 'deployed/')
})
