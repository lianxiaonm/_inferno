// 定义路径相关
const path             = require('path')
const rootPath         = path.resolve(__dirname, '../');
// 命令行参数
const argvs            = require('minimist')(process.argv.slice(2));
const appName          = argvs['app-name'] || 'src';
const currEnvName      = argvs.env || 'production';
// 定义配置相关
const isProd           = (process.env.NODE_ENV === 'production');
// 定义webpack相关
const webpack          = require('webpack');
const wpCfg            = require('../config/webpack.config.spa.js');
const compiler         = webpack(wpCfg.getConfig({appName, currEnvName}));
const compilerCallback = (err, stats) => {
    if (err === null && stats.compilation.errors.length === 0) {
        console.log(stats.toString({
            context     : rootPath,
            colors      : {level: 2, hasBasic: true, has256: true, has16m: false},
            cached      : false,
            cachedAssets: false,
            exclude     : undefined,
            maxModules  : Infinity,
            modules     : true
        }));
        console.log('编译成功...')
    } else {
        console.log('编译出现错误...');
        console.log(stats.compilation.errors[0].message)
    }
}

// 执行建构
if (!isProd) {
    compiler.run(compilerCallback)
} else {
    compiler.watch({}, compilerCallback)
}

