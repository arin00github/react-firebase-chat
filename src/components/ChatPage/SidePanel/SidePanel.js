import UserPanel from './UserPanel';
import Favorited from './Favorited';
import ChatRooms from './ChatRooms';


export default function SidePanel (){
    return (
        <div style={{
            backgroundColor: "#7b83eb",
            padding: '2rem',
            minHeight: '100vh',
            color:'white',
            minWidth:'275px'
        }}>
            <UserPanel />
            <Favorited />
            <ChatRooms />
            <div>SidePanel</div>
        </div>
    )
}