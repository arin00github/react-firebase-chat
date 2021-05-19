import { Component } from "react"
import MessageHeader from './MessageHeader';
import Message from './Message';
import MessageForm from './MessageForm';
import { connect } from "react-redux";
import firebase from '../../../firebase';
export class MainPanel extends Component {

    //can't not read setState undefined 오류 피하기 위해서는 contructor에 bind 시켜 놓아야 한다.(이게 하위 컴포넌트까지 전달될 경우 더욱 필요)
    constructor(props){
        super(props)
        this.handleSearchChange = this.handleSearchChange.bind(this)
    }

    state = {
        messages: [],
        messageRef : firebase.database().ref("messages"),
        messageLoading: true,
        searchTerm: "",
        searchResults: [],
        searchLoading: false,
    }

    

    handleSearchChange(event){
        this.setState(
            {
                searchTerm: event.target.value, searchLoading: true
            },
            () => this.handleSearchMessages())
        
    }

    handleSearchMessages(){
        const chatRoomMessages = [...this.state.messages];
        const regex = new RegExp(this.state.searchTerm, "gi")
        const searchResults = chatRoomMessages.reduce((acc, message) => {
            if(
                (message.content && message.content.match(regex)) ||
                message.user.name.match(regex)
            ){
                acc.push(message)
            }
            return acc;
        }, [])
        this.setState({searchResults});
        setTimeout(() => this.setState({searchLoading: false}), 1000)
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


    //value(){}이렇게 말고 value()() 이렇게 해야 바로바로 실행하는 결과가 나옴.
    renderMessages = (msgArray) => (
        msgArray.length > 0 &&
            msgArray.map((content) => <Message key={content.timestamp} user={this.props.user} msgUnit={content} />)
    )
    

    

    render(){
        const { messages, searchTerm, searchResults } = this.state;
        
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
                <MessageHeader messages={messages} handleSearchChange={this.handleSearchChange} />

                <div style={{
                    width: '100%',
                    height:'280px',
                    border: '.2rem',
                    borderRadius: '4px',
                    padding: '1rem',
                    marginBottom: '1rem',
                    overflowY: 'auto'
                }}>
                    {searchTerm 
                    ? this.renderMessages(searchResults)
                    : this.renderMessages(messages)}
                    
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