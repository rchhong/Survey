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
            this.db.collection('alerts').orderBy('inserted').get().then((querySnapshot) => {
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
        if(id === 'residents' && result.Temperature > 99){
            this.db.collection('alerts').doc(result.inserted.toString()).set(result);
        }
    }

    deleteQuestion = (question, id) => {
        this.db.collection('questions-' + id).doc(question.title).delete().then(() => {
            console.log("Document deleted.");
        }).catch((err) => {
            console.error("Error removing document: ", err);
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
    }
}

export default Firebase;
