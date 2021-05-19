import { Component } from "react"
import MessageHeader from './MessageHeader';
import Message from './Message';
import MessageForm from './MessageForm';
import { connect } from "react-redux";
import firebase from '../../../firebase';
class MainPanel extends Component {

    state = {
        messages: [],
        messageRef : firebase.database().ref("messages"),
        messageLoading: true
    }
    

    async addMessageListener(roomId){
        const { thisRoom } = this.props;
        console.log('default chatRoom', thisRoom)
        let messageArray = [];
        await this.state.messageRef.child(roomId).on("child_added", DataSnapshot => messageArray.push(DataSnapshot.val()))
        console.log('메시지 불러오는 중 messageArray', messageArray)
        await this.setState({
            messages : messageArray,
            messageLoading: false
        }, () => console.log('messages의 setState 작동'))
        console.log('chatRoom의 메시지 array를 불러옴')
        console.log('listner안에서 messages', this.state.messages)     

    }

    componentDidMount(){
        
        const { thisRoom } = this.props
        //console.log(this.props)
        if(thisRoom){
            this.addMessageListener(thisRoom.id)
            console.log('redux에 저장된 chatRoom 정보를 불러옴.', `room 이름은${thisRoom.name}`)
        }
    }

    renderMessages(messages){
        //console.log('render',messages)
        messages.lenght > 0 &&
        messages.map((content) => <Message key={content.timestamp} user={this.props.user} content={content} />)
    }
    


    render(){
        const { messages } = this.state;
        
        if(messages.length > 0){
            console.log('제대로 저장된 messageArray', messages)
            console.log(messages.length, '메시지 갯수')
        }else{
            console.log('갯수 0개 messageArray', messages)
            //다음 밑의 코드는 작동이 안됨
            //console.log(messages[0].content)
            console.log(messages.length, messages[0], '메시지 갯수')
        }

        return (
            <div style={{padding: '2rem 2rem 0 2rem'}}>
                <MessageHeader />

                <div style={{
                    width: '100%',
                    height:'280px',
                    border: '.2rem',
                    borderRadius: '4px',
                    padding: '1rem',
                    marginBottom: '1rem',
                    overflowY: 'auto'
                }}>
                    {/* {this.renderMessages(messages)} */}
                    { messages.length > 0 && messages.map((content) => <Message key={content.timestamp} user={this.props.user} msgUnit={content} />)}
                </div>

                <MessageForm />
            </div>
        )
    }
    
}

const mapStateToProps = state => {
    return {
        user: state.user.currentUser,
        thisRoom: state.chatting.currentRoom
    }
}


export default connect(mapStateToProps)(MainPanel)