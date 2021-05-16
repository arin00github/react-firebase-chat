import {combineReducers }from 'redux';
import user from './reducers/user_reducer';
import chatting from './reducers/chatRoom_reducer';

const rootReducers = combineReducers({
    user,
    chatting
})

export default rootReducers;