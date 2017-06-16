import Inferno, { linkEvent } from 'inferno'
// import {Provider} from 'inferno-redux'
import { Router } from 'inferno-router'
import createHashHistory from 'history/createHashHistory'


import routes from './configs/routes'

import '../plugin/common/framework'
import '../plugin/common/less/layout.less'

const history = createHashHistory();

// import {configureStore} from './store/configureStore'
// const store = configureStore();

const enter = function () {
    console.log(arguments)
}
const leave = function () {
    console.log(arguments)
}

Inferno.render(
    <Router history={history} children={routes}/>,
    document.getElementById('app')
)
