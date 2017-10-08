import Inferno from 'inferno'
//import {Provider} from 'inferno-redux'
import { Router } from 'inferno-router'
import createHistory from 'history/createBrowserHistory'

import routes from './configs/routes'

// import {configureStore} from './store/configureStore'
// const store = configureStore();
const history = createHistory();

Inferno.render(
    <Router history={history} children={routes}/>,
    document.getElementById('app')
);