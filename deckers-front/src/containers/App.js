import React from "react";
import { Provider } from "react-redux";
import { configureStore } from "../store";
import { BrowserRouter as Router } from "react-router-dom";
import Main from './Main';
import { setAuthorizationToken, setCurrentUser, reloadUser } from "../store/actions/auth";
import jwtDecode from "jwt-decode";


const store = configureStore();

if (localStorage.jwtToken) {
  setAuthorizationToken(localStorage.jwtToken);
  // prevent someone from manually tampering with the key of jwtToken in localStorage
      //RELOAD USER GOES HERE
  try {
    let tokenDecoded = jwtDecode(localStorage.jwtToken);
    store.dispatch(reloadUser(tokenDecoded.email));
    // store.dispatch(setCurrentUser(jwtDecode(localStorage.jwtToken)));
  } catch (e) {
    store.dispatch(setCurrentUser({}));
  }
}

// window.beforeunload = (event) => {
//   store.dispatch(setCurrentUser({}));
//   localStorage.clear();
// };

const App = () => (
  <Provider store={store}>
    <Router>
      <Main />
    </Router>
  </Provider>
);

export default App;
