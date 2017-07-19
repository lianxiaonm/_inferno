/**
 * 产线环境配置信息
 * @Author: xujia
 */
const path     = require('path')
const rootPath = path.resolve(__dirname, '../')
const base     = require('./metadata.webpack.config.base')
const merge    = require('webpack-merge')

module.exports = merge(base, {
    env       : {
        NODE_ENV: '"production"'
    },
    deployPath: path.resolve(rootPath, 'deployed/')
})


