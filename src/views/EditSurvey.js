import React, { useState, useEffect, useContext } from 'react';
import FirebaseContext from '../firebase/firebaseContext'

export default function EditSurvey() {

    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState("");

    const {getQuestions, pushQuestion} = useContext(FirebaseContext);

    useEffect(() => {
        let isSubscribed = true;
        // const SERVER_URL = process.env.REACT_APP_SERVER_URL;
        // let getQuestions = async () => {
        //     await fetch(SERVER_URL + '/api/questions/')
        //     .then((res) => res.json())
        //     .then((data) => {
        //         if(isSubscribed) {
        //             setQuestions(data.questions);
        //             setLoading(false);
        //         }
        //     });
        // }
        let getData = async () => {
            await getQuestions().then((data) => {
                if(isSubscribed) {
                    setQuestions(data);
                    setLoading(false);
                }
            });
        }
        getData();

        return () => {isSubscribed = false;}
    }, [questions]);



    const handleSubmit = () => {
        // const SERVER_URL = process.env.REACT_APP_SERVER_URL;
        // fetch(SERVER_URL + "/api/questions/add", {
        //     method: 'POST',
        //     headers: {
        //         Accept: 'application/json',
        //         'Content-Type': 'application/json',
        //     },
        //     body : JSON.stringify({title})
        // })
        pushQuestion({title, inserted : new Date()});
        setTitle("");
    }
    
    return (
        <div>
            <h1>Edit Survey</h1>
            {
                loading ? <div>loading</div> : null
            }
            <ol>
                {loading ? null : questions.map((question, index) => {
                    return <li key={index}>{question.title}</li>;
                })}
            </ol>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)}></input>
            <button onClick={handleSubmit.bind(this)}>Submit</button>
        </div>
    );
}