import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import MainPanel from "./MainPanel/MainPanel";
import SidePanel from "./SidePanel/SidePanel";


export default function ChatPage(){

    const thisRoom = useSelector(state => state.chatting.currentRoom);
    
    //console.log("page_ thisRoom", thisRoom);

    return (
        <div style={{display: 'flex'}}>
            <div style={{width: '300px'}}>
            <SidePanel />
            </div>
            <div style={{width: "100%"}}>
            <MainPanel thisRoom={thisRoom} key={thisRoom && thisRoom.id} />
            </div>
        </div>
    )
}