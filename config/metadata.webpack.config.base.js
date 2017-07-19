/**
 * 基础配置信息
 * @Author: xujia
 */
module.exports = {
    // 静态资源路径
    publicPath : {
        spa: '/',  // for spa
        ssr: '/'  // for ssr
    },
    cacheMaxAge: 3 * 30 * 24 * 3600 * 1000. // 90d
}
