/*
 * 按需路由配置
 * */
module.exports = {
    path: '/form',//路径定义
    getComponent(nextState, cb) {//获取模块回调
        require.ensure([], (require) => {
            cb(null, require('../pages/formPage').default)
        })
    },
    childRoutes: []
}
