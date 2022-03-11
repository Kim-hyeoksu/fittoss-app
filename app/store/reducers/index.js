import { combineReducers } from "redux";
import User from './user_reducer';
import Profile from './profile_reducer';
import Members from './member_reducer';

const rootReducer = combineReducers({
    User,
    Profile,
    Members
});

export default rootReducer;