import * as ActionTypes from './ActionTypes';

export const auth = (state = { errMess: null, email: null }, action) => {
    switch (action.type) {
        case ActionTypes.ADD_AUTH:
            return { ...state, errMess: null, email: action.payload };

        case ActionTypes.DEL_AUTH:
            return { ...state, errMess: null, email: null };
        
            default:
            return state;
    }
};