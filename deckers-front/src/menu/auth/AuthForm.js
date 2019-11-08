import React, { Component } from "react";
import { Link } from 'react-router-dom';

import wrapperBackground from '../../graphic/background_02.PNG'
import formBackground from '../../graphic/background_auth.png'
import buttonBackground from '../../graphic/button_long_01.png'

import avatars from '../../graphic/avatars'

import styled from "styled-components"

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  
    height:100%;

    background-image: url(${wrapperBackground});
    background-size: cover;
    background-repeat: no-repeat;

`

const Form = styled.form`
    background: #424858;
    border-radius: 20px;
    padding: 0 30px;

    width: 40%;
    transition: all 0.2s;

    color: white;
    text-shadow: 2px 1px #303433;
    border-radius: 20px;
    padding-top:20px;
    text-align: center;

    -webkit-box-shadow:  10px 10px 5px 0px rgba(0,0,0,0.75);
    -moz-box-shadow: 10px 10px 5px 0px rgba(0,0,0,0.75);
    box-shadow: 10px 10px 5px 0px rgba(0,0,0,0.75);
`

const Input = styled.input`
    border: none;
    color: black;
    width: 100%;

    padding: 5px 15px;
    border-radius: 10px;
`

const Button = styled.button`
    background: #8FC320 ;
    width: 200px;
    color: white;

    height: 50px;
    margin: 10px;

    border:none;
    border-radius: 10px;
    font-size: 24px;
    cursor: pointer;
    transition: all 0.4s;

    :focus {outline:0;};
    :hover{ background: #9FD430;};
    :disabled {
        opacity: 0.65;
        cursor: inherit;
        background: ${props => props.danger ? "#c8423e" : "#8FC320"} ;
    }
`

const Label = styled.label`
    display:block;
    text-align:left;

    margin-bottom: 0;
    margin-top: 10px;
`

const Title = styled.h2`
    text-shadow: 2px 2px #333;
    padding: 10px 0;

    border-radius: 10px;
    background: #556574;
`

class AuthForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            username: "",
            password: "",
            avatarID: Math.floor(Math.random() * avatars.size)
        };
    }

    handleSubmit = e => {
        e.preventDefault();
        const { login } = this.props;

        const authType = !login ? "register" : "login";
        this.props
            .onAuth(authType, this.state)
            .then(() => {
                this.props.history.push("/matchmaking");
            })
            .catch(() => {
                return;
            });
    };

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    render() {
        const { email, username, password } = this.state;
        const { login } = this.props;

        const heading = login ? 'Welcome! Please log in.' : "Register today!";
        const buttonText = login ? "Log in" : "Sign me up!";

        const isWindowTooSmall = window.innerWidth < 1000;

        return (
            <Wrapper>
                <Form onSubmit={this.handleSubmit}>
                    <Title>{heading}</Title>
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                        autoComplete="off"
                        id="email"
                        name="email"
                        onChange={this.handleChange}
                        type="text"
                        value={email}
                    />
                    <Label htmlFor="password">Password</Label>
                    <Input
                        autoComplete="off"
                        id="password"
                        name="password"
                        onChange={this.handleChange}
                        type="password"
                        value={password}
                    />
                    {!login && (
                        <>
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                autoComplete="off"
                                name="username"
                                onChange={this.handleChange}
                                type="text"
                                value={username}
                            />
                        </>
                    )}
                    <Button type="submit" disabled={isWindowTooSmall}>
                        {buttonText}
                    </Button>
                    {isWindowTooSmall && <p>We currently do not support your device </p>}

                    {login && !isWindowTooSmall && (<p>New here? <br /> You can signup <Link to="/register">here</Link></p>)}
                    {!login && !isWindowTooSmall && (<p>Already signed up? <br />Login <Link to="/login">here</Link></p>)}
                </Form>
            </Wrapper>
        );
    }
}

export default AuthForm;