/**
 * author: 罗坚棕
 * 构建store方法
 */
import { createStore, applyMiddleware ,compose} from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';
const finalCreateStore = compose(
    applyMiddleware(thunk), f => f
)(createStore);
/**
 * 构建store方法
 */
export function configureStore(initialState) {
    const store = finalCreateStore(rootReducer, initialState, applyMiddleware(thunk));
    if (module && module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('../reducers', () => {
            const nextReducer = require('../reducers/index');
            store.replaceReducer(nextReducer)
        })
    }
    return store
}