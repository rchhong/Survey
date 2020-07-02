import React, { useState, useContext, useEffect, useCallback } from "react";
import FirebaseContext from "../firebase/firebaseContext";
import AuthContext from "../auth/authContext";
import "./Login.css";

export default function Login(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { signInFirebase } = useContext(FirebaseContext);
  const user = useContext(AuthContext);

  const handleSubmit = useCallback(async () => {
    await signInFirebase(username, password)
      .catch((err) => {
        alert(err);
      });
  }, [signInFirebase, username, password]);

  useEffect(() => {
    console.log('Signed in...', user);
    if (user.user !== null) props.history.push("/");
  }, [user, props.history]);

  useEffect(() => {
    let handleKeyPress = (e) => {
      if (e.keyCode === 13) {
        handleSubmit();
      }
    };

    document.addEventListener("keypress", handleKeyPress);

    return () => {
      document.removeEventListener("keypress", handleKeyPress);
    };
  }, [handleSubmit]);

  return (
    <div className="main-login">
      <h1>Login</h1>
      <div>
        <div>Username</div>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          type="text"
        />
      </div>
      <div style={{ marginTop: "10px" }}>
        <div>Password</div>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
        />
      </div>
      <button onClick={() => handleSubmit()}>Submit</button>
    </div>
  );
}
