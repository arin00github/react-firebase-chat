import { Button, Form, Modal } from "react-bootstrap";
import { Component } from "react";
import { FaRegSmileWink, FaPlus } from 'react-icons/fa';
import { connect } from 'react-redux';
import firebase from '../../../firebase';

class ChatRooms extends Component {
    
    state = {
        show: false,
        name: "",
        description: "",
        chatRoomsRef: firebase.database().ref('chatRooms'),
        chatRooms: [],
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
            // await firebase.database().ref('chatRooms').child(key).update(newChatRoom, (err) => {
            //     if(err){
            //         console.log(err)
            //     }else{
            //         console.log("Data save successfully!")
            //     }
            //});
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

    componentDidMount(){
        this.AddChatRoomsListener();
    }

    AddChatRoomsListener = () => {
        let roomArray = [];
        this.state.chatRoomsRef.on("child_added", DataSnapshot => {
            roomArray.push(DataSnapshot.val());
            console.log(roomArray);
            this.setState({chatRooms: roomArray})
    })}
    renderChatRooms = (chatRooms) => {
        if(chatRooms.length > 0){
            return(
                <>
                
                </>
            )
        }
    }
       


    

    
    render(){
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
                    {this.state.chatRooms.length > 0 && this.state.chatRooms.map((room)=> (
                    <li onClick={() => console.log(room)}># {room.name}</li>
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