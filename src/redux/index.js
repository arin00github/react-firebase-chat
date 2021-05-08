import {combineReducers }from 'redux';
import user from './reducers/user_reducer';

const rootReducers = combineReducers({
    user,
    //chatRoom
})

export default rootReducers;