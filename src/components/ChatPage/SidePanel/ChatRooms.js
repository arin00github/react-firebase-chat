import { Button, Form, Modal } from "react-bootstrap";
import { Component } from "react";
import { FaRegSmileWink, FaPlus } from 'react-icons/fa';
import { connect } from 'react-redux';
import firebase from '../../../firebase';
import { setCurrentChatRoom } from "../../../redux/actions/chatRoom_action";

class ChatRooms extends Component {
    
    state = {
        show: false,
        name: "",
        description: "",
        chatRoomsRef: firebase.database().ref('chatRooms'),
        chatRooms: [],
        firstLoad: true,
        activeRoomId : '',
    }


    handleClose = () => this.setState({ show: false})
    handleOpen = () => this.setState({ show : true})

    handleSubmit = (e) => {
        e.preventDefault();
        const {name, description} = this.state;

        if(this.isFormValid(name, description)){
            this.addChatRoom();
        }
    }
    

    addChatRoom = async() => {

        const key = this.state.chatRoomsRef.push().key;
        const { name, description } = this.state;
        const { user } = this.props;
        console.log(user);
        const newChatRoom = {
            id: key,
            name: name,
            description: description,
            createdBy: {
                name: user.displayName,
                image: user.photoURL
            }
        }

        //ChatRoom 테이블 생성 및 업데이트
        try{
            await this.state.chatRoomsRef.child(key).set(newChatRoom, (err)=> {
                if(err){
                    console.log(err);
                }
            })
            //초기화
            this.setState({
                name: "",
                description: "",
                show: false
            })
        } catch( error) {
            console.log("addChatRoom error", error);

        }

    }

    isFormValid = (name, description) => name && description;

    

    setFirstChatRoom = () => {
        if(this.state.firstLoad && this.state.chatRooms.length > 0){
            const firstRoom = this.state.chatRooms[0]
            console.log(firstRoom);
            this.props.dispatch(setCurrentChatRoom(firstRoom));
            this.setState({activeRoomId: firstRoom.id})
        }
        this.setState({firstLoad: false})
        
    }

    AddChatRoomsListener = () => {
        let roomArray = [];
        this.state.chatRoomsRef.on("child_added", DataSnapshot => {
            roomArray.push(DataSnapshot.val());
            //console.log(roomArray);
            this.setState({chatRooms: roomArray}, () => this.setFirstChatRoom())
    })}


    changeChatRoom = (room) => {
        console.log(room);
        this.props.dispatch(setCurrentChatRoom(room))
        this.setState({activeRoomId: room.id})
        
    }
    //현재 작동이 안됨
    renderChatRooms = (chatRooms) => {
        //console.log(chatRooms)
        if(chatRooms.length > 0){
            chatRooms.map(room => {
                return (
                    <li key={room.id} 
                        style= {{backgroundColor: room.id === this.state.activeRoomId && "#ffff45"}}
                        onClick={() => this.changeChatRoom(room)}
                        >
                        #{room.name}
                    </li>
                )
            })
        }
    }
    componentDidMount(){
        this.AddChatRoomsListener();
    }
       
    componentWillUnmount(){
        this.state.chatRoomsRef.off();
    }


    

    
    render(){
        //console.log('active room', this.state.activeRoomId)
        const { chatRooms } = this.state
        return(
            <div>
                <div style={{
                    position: 'relative', width: "100%", display: 'flex', alignItems:'center'
                }}>
                    <FaRegSmileWink style={{marginRight: 3}} />
                    CHAT ROOMS {" "} (1)
                    <FaPlus
                        onClick={this.handleOpen} 
                        style={{
                        position:'absolute',
                        right:0, cursor: 'pointer'
                    }} />
                    
                </div>
                <ul style={{padding: 0, listStyle: "none"}}>
                    {this.renderChatRooms(chatRooms)} {/*작동이 안되고 있다. 왜??? */}
                    {chatRooms.length > 0 && chatRooms.map((room) => (
                        <li key={room.id} onClick={() => this.changeChatRoom(room)}
                        style= {{backgroundColor: room.id === this.state.activeRoomId && "#273bad"}}
                        >{room.name}</li>
                    ))}
                </ul>
                {/** ADD CHAT ROOM MODAL */}
                <Modal show={this.state.show} onHide={this.handleClose} 
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Create a Chat Room</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="formRoomName">
                                <Form.Label>방이름</Form.Label>
                                <Form.Control
                                 onChange={(e)=> this.setState({name: e.target.value})}
                                 type="text" placeholder="Enter room name" />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>방설명</Form.Label>
                                <Form.Control
                                 onChange={(e)=> this.setState({description: e.target.value})}
                                 type="text" placeholder="Enter description" />
                            </Form.Group>
                        </Form>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>Close</Button>
                        <Button variant="primary" onClick={this.handleSubmit}>Save Data</Button>
                    </Modal.Footer>

                </Modal>



            </div>
        )
    }
    
}
const mapStateToProps = state => {
    return {
        user: state.user.currentUser
    }
}




export default connect(mapStateToProps)(ChatRooms)