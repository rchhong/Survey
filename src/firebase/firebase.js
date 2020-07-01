import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const appConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};


class Firebase {
    constructor() {
        app.initializeApp(appConfig);

        this.auth = app.auth();
        this.db = app.firestore();
    }

    getQuestions = (id) => {
        return new Promise((res, rej) => {
            this.db.collection('questions-' + id).orderBy("inserted").get().then((querySnapshot) => {
                let ret = [];
                querySnapshot.forEach((doc) => {
                    ret.push({_id : doc.id, ...doc.data()});
                })
                return ret;
            }).then((ret) => res(ret));
        });
    }

    getAlerts = () => {
        return new Promise((res, rej) => {
            this.db.collection('alerts').orderBy('confidence', 'desc').orderBy('inserted').limit(10).get().then((querySnapshot) => {
                let ret = [];
                querySnapshot.forEach((doc) =>{
                    ret.push({_id : doc.id, ...doc.data()});
                })
                return ret;
            }).then((ret) => res(ret));
        });
    }

    // TODO: resolve hotfix
    pushQuestion = (question, id) => {
        this.db.collection('questions-' + id).doc(question.title).set(question);
    }

    pushResults = (result, id) => {
        this.db.collection('results-' + id).doc(result.inserted.toString()).set(result);
        if(id === 'residents'){
            let confidence = (result) => {
                // initialize softmaxed probabilistic variables
                let w_fever = 0.12289047498959;
                let w_cong = 0.12772678768135;
                let w_cough = 0.12547336581278;
                let w_head = 0.12044102071359;
                let w_sore = 0.12271854870109;
                let w_fatigue = 0.13551651454441;
                let w_short = 0.12390231977844;
                let w_chills = 0.12133096777876;
                let conf = 0;
                if(result['Temperature'] > 99.6) {conf += w_fever * (result['Temperature'] - 99.6) / 2;}
                if(result['Congestion']) {conf += w_cong;}
                if(result['Cough']) {conf += w_cough;}
                if(result['Headache']){conf += w_head;}
                if(result['Soreness']){conf += w_sore;}
                if(result['Fatigue']){conf += w_fatigue;}
                if(result['Short of Breath']){conf += w_short;}
                if(result['Chills']){conf += w_chills};
                result = {confidence: conf, ...result};
                return result;
            };
            this.db.collection('alerts').doc(result.inserted.toString()).set(confidence(result));
        }
    }

    deleteQuestion = (question, id) => {
        this.db.collection('questions-' + id).doc(question.title).delete().then(() => {
            console.log("Document deleted.");
        }).catch((err) => {
            console.error("Error removing document: ", err);
        });
    }

    changeQuestionType = (question, id, qtype) => {
        this.db.collection('questions-' + id).doc(question.title).update({
            type : qtype
        }).then(() => {
            console.log("Question type updated.");
        }).catch((err) => {
            console.error("Error changing question type: ", err);
        });
    }

    deleteAlerts = (alert) => {
        this.db.collection('alerts').doc(alert._id).delete().then(() =>{
            console.log("Alert deleted.");
        }).catch((err) => {
            console.error("Error removing alert: ", err);
        });
    }

    dumpData = (id) => {
        console.log('id is', id);
        return new Promise((res, rej) => {
            this.db.collection('results-' + id).orderBy('inserted').get().then((querySnapshot) => {
                let ret = [];
                querySnapshot.forEach((doc) => {
                    ret.push({id : doc.id, ...doc.data()});
                });
                return ret;
            }).then((ret) => res(ret));
        });
    };

    signInFirebase = (email, password) => {
        return this.auth.signInWithEmailAndPassword(email, password);
    }

    signOutFirebase = () => {
        return this.auth.signOut();
    }

    getNames = (id) => {
        console.log('id is', id);
        return new Promise((res, rej) => {
            this.db.collection('results-' + id).orderBy('inserted').get().then((querySnapshot) => {
                let ret = [];
                querySnapshot.forEach((doc) => {
                    ret.push(doc.data()["Name"]);
                    ret.push(doc.data()["name"]);
                });
                return ret;
            }).then((ret) => res(ret));
        })
    }

    getContactTracing = (roomNum, numDays) => {
        let furthestBack = new Date() - numDays * 24 * 60 * 60 * 1000;
        let ids = ['residents', 'team', 'visitors'];

        let requests = ids.map(id => (
            new Promise((res, rej) => {
                    this.db.collection('results-' + id).orderBy('inserted').get().then((querySnapshot) => {
                        let ret = [];
                        querySnapshot.forEach((doc) => {
                            let data = doc.data();
                            // eslint-disable-next-line
                            if(data.inserted.seconds * 1000 >= furthestBack && data["Room Number"] == roomNum) {
                                ret.push({id : doc.id, ...doc.data()});
                            }
                        });
                        return ret;
                    }).then((data) => res({type : id, data}))
                })
        ));

        return Promise.all(requests);
    }

  getCurrentRole = (uuid) => {
      return new Promise((res, rej) => {
        if(!uuid) res("none")

        this.db.collection("roles").doc(uuid).get().then((doc) => {
          console.log(doc.data());
          return doc.data()['role'];
        }).then((role) => res(role)).catch((err) => {
          console.log(err);
          return "none"
        });
      });
  }
}

export default Firebase;
