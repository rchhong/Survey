import React, { useEffect, useState, useContext} from 'react';
import FirebaseContext from '../firebase/firebaseContext'

export default function Survey(props) {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [results, setResults] = useState({});

    const {getQuestions, pushResults} = useContext(FirebaseContext);

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

        return () => {isSubscribed = false;}
    }, [getQuestions, id]);

    const handleChange = (e, index) => {
        setResults({...results, [questions[index].title] : e.target.value, inserted : new Date()});
        console.log(results);
    }


    const handleSubmit = () => {
        let payload = {};
        Object.keys(results).forEach((key, index) => {
            if(isNaN(Number(results[key]))){
                payload[key] = results[key];
            }else{
                payload[key] = Number(results[key]);
            }
        });
        pushResults({...payload, inserted : new Date()}, id)
        setResults({});
    }

    return (
        <div>
            <h1>Survey</h1>
            {
                loading ? <div>loading</div> : null
            }
            {
                loading ? null : questions.map((question, index) => {
                    return (
                        <div key={index}>
                            <div>{ question.title }</div>
                            <input type="text" value={results[question.title] || ''} onChange={e => handleChange(e, index)}></input>
                        </div>
                    )
                })
            }
            <button onClick={handleSubmit.bind(this)}>Submit</button>
        </div>

    );
}
