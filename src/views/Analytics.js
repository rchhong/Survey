import React, { useState, useEffect, useContext } from 'react';
import FirebaseContext from '../firebase/firebaseContext'

export default function Analytics(props){

    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [changed, setChanged] = useState(false);

    const { getAlerts, deleteAlerts } = useContext(FirebaseContext);

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
        setChanged(false);
        console.log('effect running');

        return () => {isSubscribed = false;}
    }, [getAlerts, changed]);

    const handleDelete = (val) => {
        deleteAlerts({_id : val});
        setChanged(true);
        console.log('changed is ', changed)
    }

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
                                        <button value={alert._id} onClick={e => {handleDelete(e.target.value);}}>
                                            Dismiss Alert
                                        </button>
                                    </li>
                                );
                            })
                        }
                    </ol>
                </div>
           );
}
