import React from 'react'
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyDmhXROw9n5EHmk6DzrNpJaO_pF3rC3DVA",
  authDomain: "chat-app-b6f83.firebaseapp.com",
  projectId: "chat-app-b6f83",
  storageBucket: "chat-app-b6f83.appspot.com",
  messagingSenderId: "666548014097",
  appId: "1:666548014097:web:48aea623c38f3800c635b0",
  measurementId: "G-V8SX9JQJ1M"
})

const auth =firebase.auth();
const firestore = firebase.firestore();

function App() {

const [user] = useAuthState(auth)

  return (
    <div className="App">
      <header>

      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithGoogle(provider);

  }
  return (
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  )
}

function SignOut() {
  return auth.currentUser && (

    <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom() {

  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, {idField: 'id'});

  const [formValue, setFormValue] = useState('')


  const sendMessage = async(e) => {

    e.preventDefault();

    const {uid, photoURL} = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid, 
      photoURL
    })
    setFormValue('')
  }

  return (
    <div>
    <div>
      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
    </div>

    <form onSubmit={sendMessage}>

      <input value={formValue} onChange={(e) => setFormValue(e.target.value)}/>

      <button type="submit">send</button>
    </form>
    </div>
  )
}

function ChatMessage(props){
  const {text, uid, photoURL} = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return 
  <div className={`message ${messageClass}`}> 
    <img src={photoURL} />
    <p>{text}</p>
  </div>
}

export default App;
