import React, { useContext } from "react";
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

  if (user.user === null) props.history.push("/login");

  return (
    <div class="main-home">
      <h1>Home</h1>
      <div class="login-status">
        {user.user === null ? "not logged in" : "logged in"}
      </div>
      <div class="button-container">
        <a href="/survey/visitors" class="button">
          Visitor Log
        </a>
        <a href="/edit/visitors" class="button">
          Edit Visitor Log
        </a>
        <a href="/survey/team" class="button">
          Team Member Log
        </a>
        <a href="edit/team" class="button">
          Edit Team Member Log
        </a>
        <a href="/survey/residents" class="button">
          Resident Log
        </a>
        <a href="/edit/residents" class="button">
          Edit Resident Log
        </a>
        <a href="/survey/sanitize" class="button">
          Cleaning Log
        </a>
        <a href="/edit/sanitize" class="button">
          Edit Cleaning Log
        </a>
        <a href="/analytics" class="button">
          Analytics
        </a>
        <button onClick={() => handleSignOut()}>Log Out</button>
      </div>
    </div>
  );
}
