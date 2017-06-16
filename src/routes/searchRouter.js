/*
 * 按需路由配置
 * */
module.exports = {
    path: '/search',//路径定义
    getComponent(nextState, cb) {//获取模块回调
        require.ensure([], () => {
            cb(null, require('../pages/searchPage').default)
        })
    },
    childRoutes: []
}
