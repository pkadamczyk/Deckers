import React from "react";
import Navbar from "../menu/Navbar";
import Content from "../menu/Content";
import AuthForm from "../menu/auth/AuthForm";
import Game from '../gameplay/containers/Game';
import Landing from "../landing/Landing"
import { Switch, Route, withRouter, Redirect } from "react-router-dom";
import { authUser } from "../store/actions/auth";
import { connect } from "react-redux";

import styled from "styled-components"
import wrapperBackground from '../graphic/background_03.png'

const Wrapper = styled.div`
    background-image: url(${wrapperBackground});
    background-size: cover;
    background-repeat: no-repeat;

    height:100%;
    display: flex;
`

const AppWrap = styled.div`
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100vh;
`

const Column = styled.div`
    width:100%;
    height: 100%;
    flex-direction: column;
`

const Main = props => {
    const { authUser, currentUser } = props;
    return (
        <AppWrap>
            <Switch>
                <Route exact path="/home" render={props => {
                    return (
                        <Landing
                            {...props}
                        />
                    );
                }} />

                <Route exact path="/login" render={props => {
                    if (currentUser.isAuthenticated) return (<Redirect to="/matchmaking" />)
                    return (
                        <AuthForm
                            onAuth={authUser}
                            login
                            {...props}
                        />
                    );
                }}

                />
                <Route exact path="/register" render={props => {
                    if (currentUser.isAuthenticated) return (<Redirect to="/matchmaking" />)
                    return (
                        <AuthForm
                            onAuth={authUser}
                            {...props}
                        />
                    );
                }}
                />

                <Route exact path="/gameplay" render={props => {
                    if (currentUser.isAuthenticated) return (<Game />)
                    return (<Redirect to="/login" />);
                }}
                />

                <Route render={props => {
                    if (currentUser.isAuthenticated) return (
                        <Wrapper>
                            <Column>
                                <Navbar />
                                <Content />
                            </Column>
                        </Wrapper>
                    )
                    return (<Redirect to="/home" />)

                }}
                />
            </Switch>
        </AppWrap>
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