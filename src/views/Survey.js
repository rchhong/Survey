import React, { useEffect, useState, useContext, useCallback } from "react";
import FirebaseContext from "../firebase/firebaseContext";
import AuthContext from "../auth/authContext";
import "./Survey.css";

export default function Survey(props) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState({});
  const [names, setNames] = useState([]);

  const { getQuestions, pushResults, getNames } = useContext(FirebaseContext);

  const id = props.match.params.id;

  const user = useContext(AuthContext);

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

    return () => {
      isSubscribed = false;
    };
  }, [getQuestions, id]);

  useEffect(() => {
    if (user.user === null) props.history.push("/login");
  }, [user, props.history]);

  useEffect(() => {
    let getData = async () => {
      await getNames(id).then((data) => {
        setNames(data);
      });
    };
    getData();
  }, [getNames, id]);

  const handleChange = (e, index) => {
    if (questions[index].type === "text") {
      setResults({
        ...results,
        [questions[index].title]: e.target.value,
        inserted: new Date(),
      });
    } else {
      setResults({
        ...results,
        [questions[index].title]: e.target.checked,
        inserted: new Date(),
      });
    }
    console.log(results);
  };

  const handleSubmit = useCallback(() => {
    let payload = {};
    console.log(payload);
    Object.keys(results).forEach((key, index) => {
      if (isNaN(Number(results[key]))) {
        payload[key] = results[key];
      } else {
        payload[key] = Number(results[key]);
      }
    });
    pushResults({ ...payload, inserted: new Date() }, id);
    setResults({});
  }, [results, pushResults, setResults, id]);

  useEffect(() => {

    let handleKeyPress = (e) => {
      if(e.keyCode === 13) {
        handleSubmit();
      }
    }

    document.addEventListener("keypress", handleKeyPress);

    return () => {document.removeEventListener("keypress", handleKeyPress)}
  }, [handleSubmit])

  const handleHome = () => {
    props.history.push("/");
  }

  return (
    <div className="main-survey">
      <div className="topbar-container">
        <div>
          <button onClick={() => handleHome()}>Home</button>
        </div>
        <h1>Log for {id}</h1>
        <div>&#8203;</div>
      </div>

      {loading ? <div>loading</div> : null}
      {loading
        ? null
        : questions.map((question, index) => {
            let isName = (question.title === 'Name')
            return (
              <div className="question-container">
                <div key={index} className="question">
                  <div>{question.title}</div>
                  <input
                    list={question.title}
                    type={question.type}
                    value={results[question.title] || ""}
                    onChange={(e) => handleChange(e, index)}
                  ></input>
                    {isName
                      ? <datalist id={question.title}>
                        {names.map((name, index) => {
                          return (
                            <option value={name}></option>
                          );
                        })}
                        </datalist>
                      : null}
                </div>
              </div>
            );
          })}
      <button onClick={handleSubmit.bind(this)}>Submit</button>
    </div>
  );
}
