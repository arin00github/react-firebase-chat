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
    

    addMessageListener(roomId){
        let messageArray = [];
        this.state.messageRef.child(roomId).on("child_added", DataSnapshot => messageArray.push(DataSnapshot.val()))
        this.setState({
            messages : messageArray,
            messageLoading: false
        })     

    }

    componentDidMount(){
        
        const { thisRoom } = this.props
        console.log(this.props)
        if(thisRoom){
            this.addMessageListener(thisRoom.id)
        }
    }

    renderMessages(messages){
        //console.log('render',messages)
        messages.lenght > 0 &&
        messages.map((content) => <Message key={content.timestamp} user={this.props.user} content={content} />)
    }


    render(){
        const { messages } = this.state;

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
                    { messages.length > 0 && messages.map((content) => <Message key={content.timestamp} user={this.props.user} content={content} />)}
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