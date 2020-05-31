import React, { useEffect, useState}from 'react';

export default function Survey() {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [results, setResults] = useState({});



    useEffect(() => {
        const SERVER_URL = process.env.REACT_APP_SERVER_URL;
        let isSubscribed = true;
        let getQuestions = async () => {
            await fetch(SERVER_URL + '/api/questions/')
            .then((res) => res.json())
            .then((data) => {
                if(isSubscribed) {
                    setQuestions(data.questions);
                    setLoading(false);
                }
            });
        }
        getQuestions();
        return () => {isSubscribed = false;}
    }, [questions]);

    const handleChange = (e, index) => {
        setResults({...results, [questions[index].title] : e.target.value});
    }


    const handleSubmit = () => {
        let payload = [];
        Object.keys(results).forEach((key, index) => {
            payload.push({question : key, result : results[key]});
        });

        fetch("http://localhost:5000/api/results/add", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body : JSON.stringify({results : payload})
        })
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
                            <input type="text" value={results[index]} onChange={e => handleChange(e, index)}></input>
                        </div>
                    )
                })
            }
            <button onClick={handleSubmit.bind(this)}>Submit</button>
        </div>

    );
}