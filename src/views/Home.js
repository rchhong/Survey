import React, { useContext } from 'react';
import { Link } from 'react-router-dom'
import FirebaseContext from '../firebase/firebaseContext';
import AuthContext from '../auth/authContext';

export default function Home(props) {

    const { signOutFirebase } = useContext(FirebaseContext);

    const user = useContext(AuthContext);

    const handleSignOut = async () => {
        await signOutFirebase()
    }

    if(user.user === null) props.history.push("/login");

    return (
        <div>
            <h1>Home</h1>
            <div>{user.user === null ? 'not logged in' : 'logged in'}</div>
            <Link to="/survey/visitors">Visitor Log</Link>
            <br></br>
            <Link to="/edit/visitors">Edit Visitor Log</Link>
            <br></br>
            <Link to="/survey/team">Team Member Log</Link>
            <br></br>
            <Link to="/edit/team">Edit Team Member Log</Link>
            <br></br>
            <Link to="/survey/residents">Resident Log</Link>
            <br></br>
            <Link to="/edit/residents">Edit Resident Log</Link>
            <br></br>
            <Link to="/edit/sanitize">Edit Cleaning Log</Link>
            <br></br>
            <Link to="/sanitize">Cleaning Log</Link>
            <br></br>
            <button onClick={() => handleSignOut()}>Log Out</button>
        </div>
    );
}
