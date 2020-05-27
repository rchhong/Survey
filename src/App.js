import React from 'react';
import { BrowserRouter as Router,
         Switch,
         Route,
} from 'react-router-dom';

import Home from './views/Home'
import Survey from './views/Survey'
import EditSurvey from './views/EditSurvey'

export default function App() {
  return (
    <Router>
        <div className='main-container'>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/survey" component={Survey} />
            <Route path='/edit' component={EditSurvey} />
          </Switch>
        </div>
    </Router>
  );
}

