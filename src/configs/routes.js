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
const rootRoute = [
    require('../routes/indexRouter'),
    require('../routes/dialogRouter'),
    require('../routes/loadingRouter'),
    require('../routes/pickerRouter'),
    require('../routes/payPwdRouter'),
    require('../routes/scrollRouter'),
    require('../routes/nativeRouter'),
    require('../routes/formRouter'),
    require('../routes/checkRouter'),
    require('../routes/iconRouter'),
    require('../routes/progressRouter'),
    require('../routes/collapseRouter'),
    require('../routes/tabRouter'),
    require('../routes/searchRouter'),
    require('../routes/scrollDemoRouter')
];
export default createRoutes(rootRoute.map(item => {
    item.onEnter = function () {
        console.log('enter ----', arguments[0])
    }
    item.onLeave = function () {
        console.log('leave ----', arguments[0])
    }
    return item;
}));
