/**
 * Created by xcs on 16/11/2.
 */
import * as Type from "../constants/ActionType.js";

export default (state = {num: 0}, action) => {
    let assign = Object.assign;
    switch (action.type) {
        case Type._RECEIVE:
            return assign({}, state, {num: 4});
        case Type._DATA:
            return assign({}, state, {num: state.num + 1});
        case Type._ACTION:
            return assign({}, state, {num: state.num - 1});
        case Type._AJAX:
            return assign({}, state, action.data);
        default:
            return state;
    }
}