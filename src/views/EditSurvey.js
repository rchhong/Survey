import React, { useState, useEffect, useContext } from 'react';
import FirebaseContext from '../firebase/firebaseContext'
import AuthContext from '../auth/authContext';

export default function EditSurvey(props) {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState("");

    const {getQuestions, pushQuestion, deleteQuestion} = useContext(FirebaseContext);
    const user = useContext(AuthContext);

    const id = props.match.params.id;

    useEffect(() => {
        if(user.user === null) props.history.push("/login");
    }, [user, props.history]); 

    useEffect(() => {
        let isSubscribed = true;
        (async () => {
            await getQuestions(id).then((data) => {
                if(isSubscribed) {
                    setQuestions(data);
                    setLoading(false);
                }
            });
        })();
        return () => {isSubscribed = false;}
    }, [id, getQuestions]);



    const handleSubmit = () => {
        pushQuestion({title, inserted : new Date()}, id);
        (async () => {
            await getQuestions(id).then((data) => {
                    setQuestions(data);
            });
        })();
        setTitle("");
    }

    const handleDelete = q => {
        //TODO: hotfixed
        deleteQuestion({title : q, inserted : new Date()}, id);
        (async () => {
            await getQuestions(id).then((data) => {
                    setQuestions(data);
            });
        })();
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
