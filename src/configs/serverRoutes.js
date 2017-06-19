/**
 * server-rendering router 不能用按需加载..
 */
import { createRoutes } from 'inferno-router'

const rootRoute = [
    {
        path: '/',//路径定义
        component: require('../pages/indexPage').default
    },
    {
        path: '/check',//路径定义
        component: require('../pages/checkPage').default
    },
    {
        path: '/collapse',//路径定义
        component: require('../pages/collapsePage').default
    },
    {
        path: '/dialog',//路径定义
        component: require('../pages/dialogPage').default
    },
    {
        path: '/form',//路径定义
        component: require('../pages/formPage').default
    },
    {
        path: '/icon',//路径定义
        component: require('../pages/icontPage').default
    },
    {
        path: '/loading',//路径定义
        component: require('../pages/loadingPage').default
    },
    {
        path: '/native',//路径定义
        component: require('../pages/nativePage').default
    },
    {
        path: '/payPwd',//路径定义
        component: require('../pages/payPwdPage').default
    },
    {
        path: '/picker',//路径定义
        component: require('../pages/pickerPage').default
    },
    {
        path: '/progress',//路径定义
        component: require('../pages/progressPage').default
    },
    {
        path: '/scrollDemo',//路径定义
        component: require('../pages/scrollDemoPage').default
    },
    {
        path: '/scroll',//路径定义
        component: require('../pages/scrollPage').default
    },
    {
        path: '/search',//路径定义
        component: require('../pages/searchPage').default
    },
    {
        path: '/tab',//路径定义
        component: require('../pages/tabPage').default
    }
];
export default createRoutes(rootRoute.map(item => {
    item.onEnter = function () {}
    item.onLeave = function () {}
    item.childRoutes = []
    return item;
}));
