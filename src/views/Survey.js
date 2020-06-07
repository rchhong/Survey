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

        return () => {isSubscribed = false;}
    }, [getQuestions, questions, id]);

    const handleChange = (e, index) => {
        setResults({...results, [questions[index].title] : e.target.value});
        console.log(results);
    }


    const handleSubmit = () => {
        let payload = [];
        Object.keys(results).forEach((key, index) => {
            payload.push({question : key, result : results[key]});
        });
        pushResults({result : payload, inserted : new Date()}, id)

        // fetch("http://localhost:5000/api/results/add", {
        //     method: 'POST',
        //     headers: {
        //         Accept: 'application/json',
        //         'Content-Type': 'application/json',
        //     },
        //     body : JSON.stringify({results : payload})
        // })
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
