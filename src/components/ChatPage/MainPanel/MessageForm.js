
import { useState } from "react";
import { Button, Col, Form, FormControl, ProgressBar, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import firebase from '../../../firebase';

export default function MessageForm (){


    const user = useSelector(state => state.user.currentUser)
    const [content, setContent] = useState("")
    const [errors, setErrors] = useState([])
    const [loading, setLoading]= useState(false)
    const messagesRef = firebase.database().ref("messages");
    const thisRoom = useSelector(state => state.chatting.currentRoom)
    //console.log('thisRoom',thisRoom);

    const handleChange = (e) => {
        setContent(e.target.value)
    }

    const createMessage = (fileUrl = null) => {
        const message = {
            timestamp : firebase.database.ServerValue.TIMESTAMP,
            user: {
                id: user.uid,
                name: user.displayName,
                image: user.photoURL
            }
        }
        if(fileUrl !== null ){
            message["image"] = fileUrl
        } else {
            message["content"] = content
        }
        console.log(message);
        return message;
    }

    const handleSubmit = async() => {
        if(!content){
            setErrors(prev => prev.concat("Type content first"))
            return true
        }
        setLoading(true);
        try{
            await messagesRef.child(thisRoom.id).push().set(createMessage());
            setLoading(false);
            setContent("")
            setErrors([])
        }catch (error){
            console.log(error);
            setErrors(pre => pre.concat(error.message))
            setLoading(false);
            setTimeout(() => {
                setErrors([])
            }, 5000)

        }
    }
    

    return (
        <div>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="message-body">
                    <Form.Label>Example textarea</Form.Label>
                    <FormControl value={content} onChange={handleChange} as="textarea" rows={3} />
                </Form.Group>
            
            <div style={{marginBottom:"10px"}}>
            <ProgressBar label="60%" now={60} />
            {errors.map(msg => <p style={{color:'red'}} key={msg.errorMsg}>{msg.errorMsg}</p>)}
            </div>
            <Row>
                <Col> <button type="submit" style={{width:"100%"}}>SEND</button>
                </Col>
                <Col> <Button style={{width:"100%"}}>UPLOAD</Button>
                </Col>
            </Row>
            </Form>
        </div>
    )
}