import Inferno from 'inferno'
//import {Provider} from 'inferno-redux'
import { Router } from 'inferno-router'
import { history } from '../plugin/common/framework'
import routes from './configs/routes'

// import {configureStore} from './store/configureStore'
// const store = configureStore();

Inferno.render(
    <Router history={history} children={routes}/>,
    document.getElementById('app')
);