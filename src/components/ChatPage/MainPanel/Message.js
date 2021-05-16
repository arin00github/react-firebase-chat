import { useState } from 'react';
import { Media } from 'react-bootstrap';
import firebase from '../../../firebase';




export default function Message ({content, user}){


    //const [time, setTime] = useState(new Date())

    const isImage = message => {
        return message.hasOwnProperty("image") && !message.hasOwnProperty("content");
    }
    const isMsgMine = (content, user) => {
        return content.user.id === user.uid
    }

    return (
        <Media className="d-flex mb-3">
            <img 
                width={48} height={48}
                alt={content.name} src={content.user.image}
                style={{ borderRadius: '10px', marginRight: '10px'}}/>
            <Media.Body style={{backgroundColor: isMsgMine(content, user) && '#cdcdee'}}>
                <h5>{content.user.name}<span style={{color:'gray', fontSize:"10px", marginLeft:'4px'}}>{new Date(content.timestamp).toLocaleString()}</span></h5>
                { isImage(content) ? (
                    <>
                    <img style={{maxWidth:'300px'}} alt="user_photo" src={content.user.image} />
                    <p>{content.content}</p>
                    </> 
                    )
                    : <p>{content.content}</p>}
                
            </Media.Body>
        </Media>
    )
}