import React, { useEffect, useState}from 'react';

export default function Survey() {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [results, setResults] = useState({});

    useEffect(() => {
        let isSubscribed = true;
        let getQuestions = async () => {
            await fetch('http://localhost:5000/api/questions/')
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
        console.log(results);
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
            <button onClick={handleSubmit}>Submit</button>
        </div>

    );
}