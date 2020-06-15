import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import Firebase from './firebase/firebase';
import { FirebaseProvider } from './firebase/firebaseContext';

ReactDOM.render(
  <FirebaseProvider value={new Firebase()}>
    <App />
  </FirebaseProvider>,
  document.getElementById('root')
);
