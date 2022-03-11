import {
    GET_MEMBERS,
    GET_MYLOG
} from '../types';

export default function(state={}, action) {
    switch(action.type) {
        case GET_MEMBERS: 
            return {
                ...state,
                member: action.payload || false
            }
        case GET_MYLOG: 
            return {
                ...state,
                mylog: action.payload || false
            }
        default:
            return state
    }
}