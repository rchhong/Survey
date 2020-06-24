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
    <div class="main-home">
      <h1>Home</h1>
      <div class="login-status">
        {user.user === null ? "Not logged in" : "Logged in"}
      </div>
      <div class="button-container">
        <Link to="/survey/visitors" class="button">
            Visitor Log
        </Link>
        <Link to="/edit/visitors" class="button">
            Edit Visitor Log
        </Link>
        <Link to="/survey/team" class="button">
            Team Member Log
        </Link>
        <Link to="/edit/team" class="button">
            Edit Team Member Log
        </Link>
        <Link to="/survey/residents" class="button">
            Resident Log
        </Link>
        <Link to="/edit/residents" class="button">
            Edit Resident Log
        </Link>
        <Link to="/survey/sanitize" class="button">
            Cleaning Log
        </Link>
        <Link to="/edit/sanitize" class="button">
            Edit Cleaning Log
        </Link>
        <Link to="/analytics" class="button">
            Analytics
        </Link>
        <button onClick={() => handleSignOut()}>Log Out</button>
      </div>
    </div>
  );
}
