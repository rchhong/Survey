import React, { useState, useEffect, useContext } from 'react';
import FirebaseContext from '../firebase/firebaseContext';
import { json2csv } from 'json-2-csv';

export default function Analytics(props){

    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [changed, setChanged] = useState(false);

    const { getAlerts, deleteAlerts, dumpData } = useContext(FirebaseContext);

    const formIds = ['residents', 'visitors', 'team']

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

    const handleDownload = (id) => {
        let getData = async () => {
            await dumpData(id).then((data) => {
                json2csv(data, (err, csv) => {
                    let content = "data:text/csv;charset=utf-8," + csv;
                    var encodedUri = encodeURI(content);

                    var link = document.createElement("a");
                    link.setAttribute("href", encodedUri);
                    link.setAttribute("download", id.concat("-")
                        .concat(Math.floor((new Date().getTime()) / 1000))
                        .concat(".csv"));

                    document.body.appendChild(link);
                    link.click();
                });
            });
        }
        getData();
    }

    // TODO: add in pertinent alert info (room number, temperature, time of alert)
    return (
                <div>
                    <h1>Analytics</h1>
                    {
                        loading ? <div>Loading alerts...</div> : null
                    }
                    {
                        formIds.map((id, idx) => {
                            return(
                                <button key={id} value={id} onClick={e => {handleDownload(e.target.value)}}>
                                    Download {id} data
                                </button>
                            )
                        })
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
