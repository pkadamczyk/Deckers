import React, { Component } from "react";
import { Provider } from "react-redux";
import { configureStore } from "../store";
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./Navbar";
import Content from "./Content";

const store = configureStore();

const App = () => (
  <Provider store={store}>
    <Router>
    <div className="row onboarding">
        <div className="col-3">
          <Navbar />
        </div>
        <div className="col-9">
          <Content />
        </div> 
      </div>
    </Router>
  </Provider>
);

export default App;
