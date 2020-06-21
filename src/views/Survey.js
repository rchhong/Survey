import React, { useEffect, useState, useContext } from "react";
import FirebaseContext from "../firebase/firebaseContext";
import "./Survey.css";

export default function Survey(props) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState({});

  const { getQuestions, pushResults } = useContext(FirebaseContext);

  const id = props.match.params.id;

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

  const handleSubmit = () => {
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
  };

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
    <div class="main">
      <h1>Survey</h1>
      {loading ? <div>loading</div> : null}
      {loading
        ? null
        : questions.map((question, index) => {
            return (
              <div class="question-container">
                <div key={index} class="question">
                  <div>{question.title}</div>
                  <input
                    type={question.type}
                    value={results[question.title] || ""}
                    onChange={(e) => handleChange(e, index)}
                  ></input>
                </div>
              </div>
            );
          })}
      <button onClick={handleSubmit.bind(this)}>Submit</button>
    </div>
  );
}
