import React, { useState, useEffect, useContext } from 'react';
import FirebaseContext from '../firebase/firebaseContext'

export default function EditSurvey(props) {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState("");

    const {getQuestions, pushQuestion, deleteQuestion} = useContext(FirebaseContext);

    const id = props.match.params.id;

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
            await getQuestions(id).then((data) => {
                if(isSubscribed) {
                    setQuestions(data);
                    setLoading(false);
                }
            });
        }
        getData();
        console.log("effect running");
        return () => {isSubscribed = false;}
    }, [getQuestions, id]);



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
        console.log('id is ' + id);
        pushQuestion({title, inserted : new Date()}, id);
        setTitle("");
    }

    const handleDelete = q => {
        //TODO: hotfixed
        deleteQuestion({title : q, inserted : new Date()}, id);
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
                    return (
                                <li key={index}>
                                    {question.title} 
                                    <button value={question.title} onClick={e => {handleDelete(e.target.value);}}>
                                        Delete
                                    </button>
                                </li>
                            );
                })}
            </ol>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)}></input>
            <button onClick={handleSubmit.bind(this)}>Submit</button>
        </div>
    );
}
