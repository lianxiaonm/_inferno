/**
 * Created by xcs on 16/11/2.
 */
import { combineReducers } from 'redux';
import _reducer from './_reducer';

// 名字必须和之前mapStateToProps 的匹配
const rootReducer = combineReducers({
    _reducer
});
export default rootReducer;
