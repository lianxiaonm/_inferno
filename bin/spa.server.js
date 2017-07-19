/**
 * SPA Server
 * @Author: xujia
 */
// 定义本地配置相关
const isProd = (process.env.NODE_ENV === 'production')
const config = isProd ? require('../config/metadata.webpack.config.prod') : require('../config/metadata.webpack.config.dev')
const PORT   = process.env.PORT || 20005

// 命令行参数
const argvs   = require('minimist')(process.argv.slice(2))
const appName = argvs['app-name'] || 'src';

// 定义路径相关
const path       = require('path')
const rootPath   = path.resolve(__dirname, '../');
const deployPath = path.join(config.deployPath, 'spa');

// express 中间件配置
const express = require('express');
const app     = express();

// 配置SPA支持history路由
const fs    = require('fs');
const files = fs.readdirSync(deployPath);
files.forEach(function (filePath) {
    if (['manifest', 'plugin', 'adaptive', 'framework'].indexOf(filePath) == -1) {
        app.use(`/${filePath}`, require('connect-history-api-fallback')({verbose: !isProd}))
    }
})

// 服务静态资源
app.use(express.static(deployPath, {maxAge: config.cacheMaxAge}));

// 启动服务器监听端口
const server = app.listen(PORT, function () {
    console.log(`spa server run in port ${PORT}`)
})
