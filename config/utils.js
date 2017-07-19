/**
 * 公用函数集合
 * @Author: xujia
 */
const path   = require('path')
const isProd = (process.env.NODE_ENV === 'production')
const config = isProd ? require('./metadata.webpack.config.prod') : require('./metadata.webpack.config.dev')

// 打印配置信息日志，用于排查错误
module.exports.logs = function () {
    log('process.env.NODE_ENV', process.env.NODE_ENV);
    log('config', config)
}
function log(name, value) {
    console.log(`${name}: ${JSON.stringify(value)}`)
}
module.exports.log = log

// 获取当前环境的静态资源路径
const envs     = require('./api-envs.config')
const appTypes = ['ssr', 'spa']
function getPrdPublicPath({currEnvName, appName, appType}) {
    const currEnvObject = envs[currEnvName];
    if (!isProd) return false;
    return (appTypes[1] == appType) ? `${currEnvObject.msApiRoot}/h5/`
        : `${currEnvObject.msApiRoot}/h5/${appName}/`;
}
module.exports.getPrdPublicPath = getPrdPublicPath

// 增加服务器的 webpack-dev-middleware 配置
module.exports.addServerDevMiddleware = function (opts) {
    var {app, compiler, clientWebpackConfig} = opts;
    var devMiddleware                        = require('webpack-dev-middleware')(compiler, {
        publicPath: clientWebpackConfig.output.publicPath
    })
    app.use(devMiddleware)
}

// 设置是服务器端的是否否浏览器自动刷新功能
module.exports.setServerHotReload = function (opts) {
    var {app, compiler, isHotReload} = opts
    if (!isHotReload) return
    var hotMiddleware = require('webpack-hot-middleware')(compiler, {
        log: () => {
        }
    })
    app.use(hotMiddleware)
}



