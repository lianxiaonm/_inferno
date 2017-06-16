/*
 * 按需路由配置
 * */
module.exports = {
    path: '/native',//路径定义
    getComponent(nextState, cb) {//获取模块回调
        require.ensure([], () => {
            cb(null, require('../pages/nativePage').default)
        })
    },
    childRoutes: []
}
