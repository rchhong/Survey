import React, { useEffect, useState, useContext} from 'react';
import FirebaseContext from '../firebase/firebaseContext'

export default function Survey(props) {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [results, setResults] = useState({});
    const [valid, setValid] = useState(false);

    const {getQuestions, pushResults} = useContext(FirebaseContext);


    const id = 'sanitize';

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

    useEffect(() => {
        let isValid = () => {
            if(loading) return false;
            if(Object.keys(results).length < questions.length) return false;

            let ret = true;
            Object.keys(results).forEach((key, index) => {
                if(!results[key]) ret = false;
            });

            return ret;
        };
        setValid(isValid());
    }, [setValid, loading, questions, results])

    useEffect(() => {
        if (user.user === null) props.history.push("/login");
      }, [user, props.history]);

    const handleChange = (index) => {
        let oldState = results[questions[index].title];
        setResults({...results, [questions[index].title] : !oldState});
    }


    const handleSubmit = () => {
        let payload = [];
        Object.keys(results).forEach((key, index) => {
            payload.push({question : key, result : results[key]});
        });
        pushResults({result : payload, inserted : new Date()}, id)
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

                            <input type="checkbox" value={results[question.title] || ''} onChange={e => handleChange(index)}></input>
                            <span>{ question.title }</span>
                        </div>
                    )
                })
            }
            <button disabled={!valid} onClick={handleSubmit.bind(this)}>Submit</button>
        </div>

    );
}
