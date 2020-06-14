import React, { useState, useEffect, useContext } from 'react';
import FirebaseContext from '../firebase/firebaseContext'

export default function Analytics(props){

    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);

    const { getAlerts } = useContext(FirebaseContext);

    useEffect(() => {
        let isSubscribed = true;
        let getData = async () => {
            await getAlerts().then((data) => {
                if(isSubscribed){
                    setAlerts(data);
                    setLoading(false);
                }
            });
        }
        getData();

        return () => {isSubscribed = false;}
    }, [getAlerts, alerts]);

    
    // TODO: add in pertinent alert info (room number, temperature, time of alert)
    return (
                <div>
                    <h1>Analytics</h1>
                    {
                        loading ? <div>Loading alerts...</div> : null
                    }
                    <ol>
                        {
                            loading ? null : alerts.map((alert, idx) => {
                                return (
                                    <li key={idx}>
                                        {alert._id}
                                    </li>
                                );
                            })
                        }
                    </ol>
                </div>
           );
}
