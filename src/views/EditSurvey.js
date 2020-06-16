import React, { useState, useEffect, useContext } from 'react';
import FirebaseContext from '../firebase/firebaseContext'

export default function EditSurvey(props) {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState("");
    const [changed, setChanged] = useState(false);

    const {getQuestions, pushQuestion, deleteQuestion} = useContext(FirebaseContext);

    const id = props.match.params.id;

    useEffect(() => {
        let isSubscribed = true;
        let getData = async () => {
            await getQuestions(id).then((data) => {
                if(isSubscribed) {
                    setQuestions(data);
                    setLoading(false);
                }
            });
        }
        getData();
        setChanged(false);

        return () => {isSubscribed = false;}
    }, [getQuestions, id, changed]);



    const handleSubmit = () => {
        pushQuestion({title, inserted : new Date()}, id);
        setTitle("");
        setChanged(true);
        console.log('changed is', changed)
    }

    const handleDelete = q => {
        //TODO: hotfixed
        deleteQuestion({title : q, inserted : new Date()}, id);
        setTitle("");
        setChanged(true);
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
