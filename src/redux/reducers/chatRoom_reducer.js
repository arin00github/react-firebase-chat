import {  SET_CURRENT_CHATROOM } from '../actions/types';


const initialRoomState = {
    currentRoom: null
}


export default function chatRoomReducer (state = initialRoomState, action){
    console.log('reducer_step', action.payload);
    switch(action.type){
        case SET_CURRENT_CHATROOM:
            return {
                ...state,
                currentRoom : action.payload,
            }
        default: 
            return state;
    }
}