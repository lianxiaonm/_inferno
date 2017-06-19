/**
 * 用于按需加载的所有路由配置
 */
import { createRoutes } from 'inferno-router'
import { extend } from '../../plugin/common/service/common'
/*{
 *    path        : '/',
 *    component   : App,
 *    indexRoute  : {
 *      component     : Home,
 *    },
 *    childRoutes : [
 *      {
 *        path : 'films/',
 *        component : Films,
 *        childRoutes : {
 *          path : 'detail/:id',
 *          component : FilmDetail,
 *        }
 *      },
 *      {
 *        path : '/*',
 *        component : NoMatch
 *      }
 *    ]
 *  }
 */
const rootRoute = [{
    path: '/',//路径定义
    component: require('../pages/indexPage').default,
    childRoutes: []
}];
export default createRoutes(rootRoute.map(item => {
    item.onEnter = function () {
        //console.log('enter ----', arguments[0])
    }
    item.onLeave = function () {
        //console.log('leave ----', arguments[0])
    }
    return item;
}));
