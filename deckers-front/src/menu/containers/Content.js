import React, { Component } from "react";
import Matchmaking from '../matchmaking/Matchmaking';
import Profile from './Profile';
import Shop from './Shop';
import Cards from './Cards';
import { Switch, Route } from "react-router-dom";

class Content extends Component {
  render() {
    return (
      <Switch>
        <Route
          exact
          path="/"
          render={props => {
            return (
              <h1> landing page</h1>
            )
          }}
        />
        <Route
          exact
          path="/matchmaking"
          render={props => <Matchmaking {...props} />}
        />
        <Route
          exact
          path="/profile"
          render={props => {
            return (
              <Profile
                {...props}
              />
            );
          }}
        />
        <Route
          path="/cards"
          render={props => {
            return (
              <Cards
                {...props}
              />
            );
          }}
        />
        <Route
          exact
          path="/shop"
          render={props => {
            return (
              <Shop
                {...props}
              />
            );
          }}
        />
      </Switch>
    );
  }
}

export default Content;