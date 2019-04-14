import React from "react";
import Navbar from "./Navbar";
import Content from "./Content";
import AuthForm from "../components/AuthForm";
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
                heading="Welcome Back."
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
            <Route render={props => {
              if (currentUser.isAuthenticated) {
                return (
                    <div className="row">
                    <div className="col-3">
                    <Navbar />
                    </div>
                    <div className="col-9">
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