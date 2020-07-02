import React, { useReducer, useMemo, useContext, useEffect } from 'react';
import { BrowserRouter as Router,
         Switch,
         Route,
} from 'react-router-dom';

import Home from './views/Home';
import Survey from './views/Survey';
import EditSurvey from './views/EditSurvey';
import Analytics from './views/Analytics';
import Login from './views/Login';
import Error from './views/Error';

import { AuthProvider } from './auth/authContext';
import FirebaseContext from './firebase/firebaseContext';

function reducer(prevState, action) {
  switch(action.type) {
    case "LOG_IN":
      return {...prevState, user: action.user};
    case "LOG_OUT":
      return {...prevState, user: null};
    case "RESTORE_USER":
      return {...prevState, user: action.user};
    default:
      throw Error("Invalid Reducer Action");
  }
}

export default function App() {
  let intialState = {user : null};

  const [state, dispatch] = useReducer(reducer, intialState);
  const Firebase = useContext(FirebaseContext);

  useEffect(() => {
    let persistLogin =
      Firebase.auth.onAuthStateChanged(async (user) => {
        if(user) {
          await Firebase.getCurrentRole(user.uid).then((role) => {
            console.log(role);
            user.role = role;
            dispatch({type: "RESTORE_USER", user});
          })
        }
        else dispatch({type: "RESTORE_USER", user: null});
      })
    return () => persistLogin();
  }, [state.user, Firebase.auth])

  const authContext = useMemo(() => ({
    ...state
  }), [state]);

  return (
  <AuthProvider value={authContext}>
      <Router>
          <div className='main-container'>
            <Switch>
              <Route exact path='/' component={Home} />
              <Route path='/survey/:id' component={Survey} />
              <Route path='/edit/:id' component={EditSurvey} />
              <Route path='/analytics' component={Analytics} />
              <Route path='/login' component={Login} />
            </Switch>
          </div>
      </Router>
  </AuthProvider>
  );
}

