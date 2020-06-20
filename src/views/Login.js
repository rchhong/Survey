import React, { useState, useContext, useEffect } from 'react';
import FirebaseContext from '../firebase/firebaseContext';
import AuthContext from '../auth/authContext';



export default function Login(props) {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const { signInFirebase } = useContext(FirebaseContext);
    const user = useContext(AuthContext);

    const handleSubmit = async () => {
        await signInFirebase(username, password).then((data) => {
            console.log(data);
        }).catch((err) => {
            console.log(err);
        })
    };

   useEffect(() => {
       if(user.user !== null) props.history.push("/");
   }, [user, props.history]); 

    return (
        <div>
            <h1>Login</h1>
            <div>
                <div>Username</div>
                <input value={username} onChange={(e) => setUsername(e.target.value)} type="text"/>
            </div>
            <div style={{marginTop: '10px'}}>
                <div>Password</div>
                <input value={password} onChange={(e) => setPassword(e.target.value)} type="password"/>
            </div>
            <button onClick={() => handleSubmit()}>Submit</button>

        </div>
    );

}