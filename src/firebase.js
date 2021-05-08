import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

var firebaseConfig = {
    apiKey: "AIzaSyDHAFcqPWYp57x3WvFYvXa54pnjElmABoY",
    authDomain: "react-firebase-chat-app-d3927.firebaseapp.com",
    databaseURL: "https://react-firebase-chat-app-d3927-default-rtdb.firebaseio.com",
    projectId: "react-firebase-chat-app-d3927",
    storageBucket: "react-firebase-chat-app-d3927.appspot.com",
    messagingSenderId: "855420554659",
    appId: "1:855420554659:web:77e4c9ea360b94f3655e16",
    measurementId: "G-09BX5X5BH0"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  //firebase.analytics();

  export default firebase;