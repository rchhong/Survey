import React from 'react';
import { BrowserRouter as Router,
         Switch,
         Route,
} from 'react-router-dom';

import Home from './views/Home';
import Survey from './views/Survey';
import EditSurvey from './views/EditSurvey';
import Analytics from './views/Analytics';

import Firebase from './firebase/firebase';
import { FirebaseProvider } from './firebase/firebaseContext';

export default function App() {
  return (
    <FirebaseProvider value={new Firebase()}>
      <Router>
          <div className='main-container'>
            <Switch>
              <Route exact path='/' component={Home} />
              <Route path='/survey/:id' component={Survey} />
              <Route path='/edit/:id' component={EditSurvey} />
              <Route path='/analytics' component={Analytics} />
            </Switch>
          </div>
      </Router>
    </FirebaseProvider>

  );
}

