
import { useState, useRef } from "react";
import { Button, Col, Form, FormControl, ProgressBar, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import firebase from '../../../firebase';
import mime from 'mime-types'
export default function MessageForm (){


    const user = useSelector(state => state.user.currentUser)
    const [content, setContent] = useState("")
    const [errors, setErrors] = useState([])
    const [loading, setLoading]= useState(false)
    const [percentage, setPercentage] = useState(0)
    const messagesRef = firebase.database().ref("messages");
    const thisRoom = useSelector(state => state.chatting.currentRoom)
    //console.log('thisRoom',thisRoom);

    const storageRef = firebase.storage().ref();

    const inputOpenImageRef = useRef()

    const handleChange = (e) => {
        setContent(e.target.value)
    }
    //메시지 생성
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
        //console.log(message);
        return message;
    }

    const handleSubmit = async() => {
        //메시지 내용이 없으면
        if(!content){
            setErrors(prev => prev.concat("Type content first"))
            return true
        }
        setLoading(true);
        //데이터 베이스에 메시지 저장
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
    //숨겨진 input 요소가 클릭이 되도록 설정
    const handleOpenImage = () => {
        inputOpenImageRef.current.click();
    }
    //이미지 업로드 코드
    const handleUploadImage = async(event) => {
        const file = event.target.files[0];
        console.log("file",file)
        if(!file) return ;
        const filePath = `message/public/${file.name}.jpg`;
        const metedata = { contentType: mime.lookup(file.name)}
        setLoading(true)
       try{
        //파일을 스토리지에 저장
        let uploadTask = storageRef.child(filePath).put(file, metedata);
        //프로그래스바 percentage를 
        uploadTask.on("state_changed", UploadTaskSnapShot => {
            const value = Math.round(
                UploadTaskSnapShot.bytesTransferred / UploadTaskSnapShot.totalBytes * 100)
                setPercentage(value)
                setLoading(false)
        },
        err => {
            console.log(err);
            setLoading(false);
        }, ()=> {
            //저장이 다 된 후 에 파잉ㄹ 메시지 정송(데이터 베이스에 저장)
            //저장된 파일을 다운 로드 받으 수 있는 URL 가져오기
            uploadTask.snapshot.ref.getDownloadURL()
            .then(downloadURL => {
                console.log( 'download',downloadURL);
                messagesRef.child(thisRoom.id).push().set(createMessage())
            })
        })
       }catch(err){
           
           console.log(err)
       }
    }
    console.log('upload_percentage', percentage)

    
    

    

    return (
        <div>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="message-body">
                    <Form.Label>Example textarea</Form.Label>
                    <FormControl value={content} onChange={handleChange} as="textarea" rows={3} />
                </Form.Group>
            
            
                { !(percentage === 0 || percentage === 100) && (
                    <ProgressBar style={{marginBottom: '10px'}} label={`${percentage}`} now={percentage} />
                )}
            
            {errors.map(msg => <p style={{color:'red'}} key={msg.errorMsg}>{msg.errorMsg}</p>)}
            
            <Row>
                <Col> <button type="submit" className="btn btn-primary" style={{width:"100%"}}>SEND</button>
                </Col>
                <Col> <Button disabled={loading ? true : false} onClick={handleOpenImage} style={{width:"100%"}}>UPLOAD</Button>
                </Col>
            </Row>
            </Form>
            <input accept="image/jpeg, image/png" style={{display: 'none'}} disabled={loading ? true : false} onChange={handleUploadImage} ref={inputOpenImageRef} type="file" />
        </div>
    )
}