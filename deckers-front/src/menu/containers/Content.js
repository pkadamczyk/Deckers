import React, { Component } from "react";
import Matchmaking from '../matchmaking/Matchmaking';
import Profile from './Profile';
import Shop from '../shop/Shop';
import Cards from '../storage/Cards';
import { Switch, Route } from "react-router-dom";

class Content extends Component {
    render() {
        return (
            <Switch>
                <Route
                    exact path="/"
                    render={props => <h1> landing page</h1>}
                />
                <Route
                    exact path="/matchmaking"
                    render={props => <Matchmaking {...props} />}
                />
                <Route
                    exact path="/profile"
                    render={props => <Profile {...props} />}
                />
                <Route
                    path="/cards"
                    render={props => <Cards {...props} />}
                />
                <Route
                    exact path="/shop"
                    render={props => <Shop {...props} />}
                />
            </Switch>
        );
    }
}

export default Content;