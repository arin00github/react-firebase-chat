import {SET_CURRENT_CHATROOM} from './types'

export function setCurrentChatRoom (current){
    //console.log('current_action',current);
    return {
        type: SET_CURRENT_CHATROOM,
        payload: current
    }
}