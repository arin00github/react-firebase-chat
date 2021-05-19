
import { Media } from 'react-bootstrap';





export default function Message ({msgUnit, user}){


    //const [time, setTime] = useState(new Date())

    const isImage = message => {
        return message.hasOwnProperty("image") && !message.hasOwnProperty("content");
    }
    const isMsgMine = (msgUnit, user) => {
        console.log('isMsgMine',Object.keys(msgUnit))
        return msgUnit.user.id === user.uid
    }
    console.log("message컴포넌트의 content",msgUnit)

    return (
        <Media className="d-flex mb-3">
            {/* <img 
                width={48} height={48}
                alt={content.user.name} src={content.user.image}
                style={{ borderRadius: '10px', marginRight: '10px'}}/> */}
            <Media.Body style={{backgroundColor: isMsgMine(msgUnit, user) && '#cdcdee'}}>
                <h5>{msgUnit.user.name}<span style={{color:'gray', fontSize:"10px", marginLeft:'4px'}}>{new Date(msgUnit.timestamp).toLocaleString()}</span></h5>
                { isImage(msgUnit) ? (
                    <>
                    <img style={{maxWidth:'300px'}} alt="user_photo" src={msgUnit.user.image} />
                    <p>{msgUnit.content}</p>
                    </> 
                    )
                    : <p>{msgUnit.content}</p>}
                
            </Media.Body>
        </Media>
    )
}