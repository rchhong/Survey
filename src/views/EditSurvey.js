import React, { useState, useEffect, useContext, useCallback } from "react";
import FirebaseContext from "../firebase/firebaseContext";
import "./EditSurvey.css";
import AuthContext from '../auth/authContext';

export default function EditSurvey(props) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [changed, setChanged] = useState(false);

  const {
    getQuestions,
    pushQuestion,
    deleteQuestion,
    changeQuestionType,
  } = useContext(FirebaseContext);
  const user = useContext(AuthContext);

  const id = props.match.params.id;

  const handleSubmit = useCallback(() => {
    pushQuestion({ title, inserted: new Date(), type: "text" }, id);
    setTitle("");
    setChanged(true);
  }, [pushQuestion, setTitle, setChanged, id, title]);

  const handleDelete = (q) => {
    //TODO: hotfixed
    deleteQuestion({ title: q, inserted: new Date(), type: "" }, id);
    setTitle("");
    setChanged(true);
  };

  const handleTypeChange = (q, t) => {
    changeQuestionType({ title: q, inserted: new Date(), type: t }, id, t);
    console.log("type changed to ", t)
    setTitle("");
    setChanged(true);
  };

  useEffect(() => {
    let isSubscribed = true;
    let getData = async () => {
      await getQuestions(id).then((data) => {
        if (isSubscribed) {
          setQuestions(data);
          setLoading(false);
        }
      });
    };
    getData();
    setChanged(false);

    return () => {
      isSubscribed = false;
    };
  }, [getQuestions, id, changed]);
    
  useEffect(() => {
    if(user.user === null) props.history.push("/login");
  }, [user, props.history]); 

  useEffect(() => {

    let handleKeyPress = (e) => {
      if(e.keyCode === 13) {
        handleSubmit();
      }
    }

    document.addEventListener("keypress", handleKeyPress);

    return () => {document.removeEventListener("keypress", handleKeyPress)}
  }, [handleSubmit])



  return (
    <div className="main">
      <h1>Edit Survey</h1>
      {loading ? <div>loading</div> : null}
      <ol>
        {loading
          ? null
          : questions.map((question, index) => {
              return (
                <div className="question-container" key={index}>
                  <li>
                    <div className="question-text">{question.title}</div>

                    <div className="buttons-selections">
                      <select
                        name="question-type"
                        id="type"
                        onChange={(e) =>
                          handleTypeChange(question.title, e.target.value)
                        }
                      >
                        <option value="text">Text</option>
                        <option value="checkbox">Check Box</option>
                      </select>
                      <button
                        value={question.title}
                        onClick={(e) => {
                          handleDelete(e.target.value);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                </div>
              );
            })}
      </ol>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      ></input>
      <button onClick={handleSubmit.bind(this)}>Submit</button>
    </div>
  );
}
