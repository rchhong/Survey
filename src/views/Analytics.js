import React, { useState, useEffect, useContext } from "react";
import FirebaseContext from "../firebase/firebaseContext";
import { json2csv } from "json-2-csv";
import "./Analytics.css";

export default function Analytics(props) {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [changed, setChanged] = useState(false);
  const [numDays, setNumDays] = useState(14);
  const [roomNum, setRoomNum] = useState(0);
  const [contactData, setContactData] = useState([]);

  const { getAlerts, deleteAlerts, dumpData, getContactTracing } = useContext(
    FirebaseContext
  );

  const formIds = ["residents", "visitors", "team", "sanitization"]

  useEffect(() => {
    let isSubscribed = true;
    let getData = async () => {
      await getAlerts().then((data) => {
        if (isSubscribed) {
          setAlerts(data);
          setLoading(false);
        }
      });
    }
    getData();
    setChanged(false);
    console.log("effect running");

    return () => {
      isSubscribed = false;
    }
  }, [getAlerts, changed]);

  const handleDelete = (val) => {
    deleteAlerts({ _id: val });
    setChanged(true);
    console.log("changed is ", changed);
  };

  const handleDownload = (id) => {
    let getData = async () => {
      await dumpData(id).then((data) => {
        json2csv(data, (err, csv) => {
          let content = "data:text/csv;charset=utf-8," + csv;
          var encodedUri = encodeURI(content);

          var link = document.createElement("a");
          link.setAttribute("href", encodedUri);
          link.setAttribute(
            "download",
            id
              .concat("-")
              .concat(Math.floor(new Date().getTime() / 1000))
              .concat(".csv")
          );

          document.body.appendChild(link);
          link.click();
        });
      });
    };
    getData();
  };

  const handleContactTracing = async (roomNum, numDays) => {
    await getContactTracing(roomNum, numDays).then((results) =>
      setContactData(results)
    );
  };

  // TODO: add in pertinent alert info (room number, temperature, time of alert)
  return (
    <div class="main-analytics">
      <h1>Analytics</h1>
      <div class="dl-buttons-container">
        {loading ? <div>Loading...</div> : null}
        {loading ? null : <h2>Download Form Data</h2>}
        {loading
          ? null
          : formIds.map((id, idx) => {
            return (
              <div>
                <button
                  key={id}
                  value={id}
                  onClick={(e) => {
                    handleDownload(e.target.value);
                  }}
                >
                  Download {id} data
                </button>
              </div>
            );
          })}
      </div>
      <div class="alerts-container">
        {loading ? null : <h2>Health Alerts</h2>}
        <ol>
          {loading
            ? null
            : alerts.map((alert, idx) => {
              return (
                <li key={idx}>
                  {alert.Name +
                    ", Date: " +
                    alert._id +
                    ",  Confidence: " +
                    Math.round(alert.confidence * 1000) / 1000}
                  <button
                    value={alert._id}
                    onClick={(e) => {
                      handleDelete(e.target.value);
                    }}
                  >
                    Dismiss Alert
                  </button>
                </li>
              );
            })}
        </ol>
      </div>
      {loading ? null : <h2>Contact Tracing</h2>}
      {loading ? null : (
        <div class="trace-container">
          <div>Room Number</div>
          <input
            type="number"
            value={roomNum}
            onChange={(e) => setRoomNum(e.target.value)}
          />
          <br></br>
          <div>{`Number of Days: ${numDays}`}</div>
          <input
            type="range"
            min="1"
            max="28"
            value={numDays}
            onChange={(e) => setNumDays(e.target.value)}
            step="1"
          />
          <br></br>
          <button onClick={() => handleContactTracing(roomNum, numDays)}>
            Submit
          </button>
        </div>
      )}
      <ol>
        {loading
          ? null
          : contactData.map((contactGroup, idx) => {
            return (
              <div key={idx}>
                <h3>{contactGroup.type}</h3>
                {contactGroup.data.map((contact, index) => (
                  <li key={index}>
                    {Object.keys(contact).map((key, idx2) => {
                      if (
                        key !== "_id" &&
                        key !== "id" &&
                        key !== "inserted"
                      ) {
                        return (
                          <div>
                            {String(key) + ": " + String(contact[key])}
                          </div>
                        );
                        // eslint-disable-next-line
                      } else if (key == "id") {
                        return <div>{"Time: " + String(contact[key])}</div>;
                      }
                      // eslint-disable-next-line
                      return;
                    })}
                  </li>
                ))}
              </div>
            );
          })}
      </ol>
    </div>
  );
}
