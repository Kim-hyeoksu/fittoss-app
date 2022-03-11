import {
    GET_PROFILE
} from '../types';

export default function(state={}, action) {
    switch(action.type) {
        case GET_PROFILE: 
            return {
                ...state,
                userProfile: action.payload || false
            }
        default:
            return state
    }
}