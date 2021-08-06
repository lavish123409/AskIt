// import firebase from 'firebase';
import firebase from 'firebase/app';
import 'firebase/auth'; 
import 'firebase/firestore';  // If using Firebase database
import 'firebase/storage';  


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBAOXI5Wjf46UticnumMDPQMXTZad9q3fM",
    authDomain: "askit-da6df.firebaseapp.com",
    projectId: "askit-da6df",
    storageBucket: "askit-da6df.appspot.com",
    messagingSenderId: "602899985700",
    appId: "1:602899985700:web:7013de9684c1f32a81efb1",
    measurementId: "G-PTJ3N2V4FF"
  };

  // console.log(firebase);


  const firebaseApp = firebase.initializeApp( firebaseConfig );

  const auth = firebase.auth();
  const provider = new firebase.auth.GoogleAuthProvider();

  const db = firebaseApp.firestore();


  export { auth , provider };
  export default db;