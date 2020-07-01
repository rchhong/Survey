import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import FirebaseContext from "../firebase/firebaseContext";
import AuthContext from "../auth/authContext";
import "./Home.css";

export default function Home(props) {
  const { signOutFirebase } = useContext(FirebaseContext);

  const user = useContext(AuthContext);

  const handleSignOut = async () => {
    await signOutFirebase();
  };

  useEffect(() => {
    if (user.user === null) props.history.push("/login");
  }, [user, props.history]);

  return (
    <div className="main-home">
      <h1>Home</h1>
      <div className="login-status">
        {user.user === null ? "Not logged in" : "Logged in"}
        <br></br>
        {user.user === null ? "Not logged in" : `User Role: ${user.user.role}`}
      </div>
      <div className="button-container">
        <Link to="/survey/visitors" className="button">
            Visitor Log
        </Link>
        <Link to="/edit/visitors" className="button">
            Edit Visitor Log
        </Link>
        <Link to="/survey/team" className="button">
            Team Member Log
        </Link>
        <Link to="/edit/team" className="button">
            Edit Team Member Log
        </Link>
        <Link to="/survey/residents" className="button">
            Resident Log
        </Link>
        <Link to="/edit/residents" className="button">
            Edit Resident Log
        </Link>
        <Link to="/analytics" className="button">
            Analytics
        </Link>
        <button onClick={() => handleSignOut()}>Log Out</button>
      </div>
    </div>
  );
}
