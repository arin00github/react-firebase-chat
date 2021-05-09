import { Route,  Switch, useHistory } from 'react-router';
import './assets/style.css';
import LoginPage from './components/LoginPage';
import ChatPage from './components/ChatPage/ChatPage';
import RegisterPage from './components/RegisterPage';
import { useEffect } from 'react';
import firebase from './firebase';
import { useDispatch } from 'react-redux';
import { setUser, clearUser } from './redux/actions/user_action';

function App(props) {

  const history = useHistory();
  const dispatch = useDispatch();


  useEffect(()=> {
    firebase.auth().onAuthStateChanged(user => {
      console.log('user', user);
      
      if(user){
        //로그인이 된 상태
        history.push("/")
        dispatch(setUser(user))
      } else {
        //로그인이 되지 않은 상태
        history.push("/login")
        dispatch(clearUser())
      }

    })
  },[dispatch, history])


  return (
    
      <Switch>
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/register" component={RegisterPage} />
        <Route exact path="/" component={ChatPage} />
      </Switch>
  
  );
}

export default App;
