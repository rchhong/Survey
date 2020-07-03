import React, { useEffect, useState, useContext, useCallback } from "react";
import FirebaseContext from "../firebase/firebaseContext";
import AuthContext from "../auth/authContext";
import "./Survey.css";

export default function Survey(props) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState({});
  const [suggestions, setSuggestions] = useState({});

  const { getQuestions, pushResults, getSuggestions } = useContext(FirebaseContext);

  const id = props.match.params.id;
  const suggestionFields = ["Name", "Email", "Phone Number", "Team member name"];

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
      await getSuggestions(id, suggestionFields).then((data) => {
          setSuggestions(data);
      });
    };
    getData();
  }, [getSuggestions, suggestionFields, id]);

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
      if (e.keyCode === 13) {
        handleSubmit();
      }
    }

    document.addEventListener("keypress", handleKeyPress);

    return () => { document.removeEventListener("keypress", handleKeyPress) }
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
          let suggestionEnabled = (suggestions.hasOwnProperty(question.title))
          return (
            <div className="question-container">
              <div key={index} className="question">
                {question.title + " "}
                <input
                  list={question.title}
                  type={question.type}
                  value={results[question.title] || ""}
                  checked={results[question.title] || false}  
                  onChange={(e) => handleChange(e, index)}
                ></input>
                {suggestionEnabled
                  ? <datalist id={question.title}>
                    {suggestions[question.title].map((suggestion, index) => {
                      return (
                        <option value={suggestion}></option>
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
