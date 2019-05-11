import React from "react";
import Navbar from "../menu/components/Navbar";
import Content from "../menu/containers/Content";
import AuthForm from "../menu/components/AuthForm";
import Game from '../gameplay/containers/Game';
import { Switch, Route, withRouter, Redirect} from "react-router-dom";
import { authUser } from "../store/actions/auth";
import { connect } from "react-redux";

const Main = props => {
        const { authUser, currentUser } = props;
      return (
        <Switch>
            <Route exact path="/login" render={props => {
              if (currentUser.isAuthenticated) {
                return (
                  <Redirect to="/"/>
                  )
                } else {
            return (
              <AuthForm
                onAuth={authUser}
                buttonText="Log in"
                login
                heading='Welcome! Please log in.'
                {...props}
              />
            );
          }
          }}
        />
        <Route exact path="/register" render={props => {
          if (currentUser.isAuthenticated) {
            return (
              <Redirect to="/"/>
              )
            } else {
            return (
              <AuthForm
                onAuth={authUser}
                signUp
                buttonText="Sign me up!"
                heading="Register today!"
                {...props}
              />
            );
            }
          }}
        />
         <Route exact path="/gameplay" render={props => {
          if (currentUser.isAuthenticated) {
            return (
              <Game/>
              )
            } else {
            return (
              <Redirect to="/login"/>);}
          }}
        />
        <Route render={props => {
          if (currentUser.isAuthenticated) {
            return (
            <div className="row">
                <div className="col-2">
                <Navbar />
                </div>
                <div className="col-10">
                <Content />
                </div> 
            </div>)
        }else{
          return (
          <Redirect to="/login"/>
          )
        }
      }}
        />
      </Switch>  
      )
}
function mapStateToProps(state) {
    return {
      currentUser: state.currentUser,
    };
  }
  
  export default withRouter(
    connect(mapStateToProps, { authUser })(Main)
  );