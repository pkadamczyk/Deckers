import React, { Component } from "react";
import { Link } from 'react-router-dom';

import wrapperBackground from '../../graphic/background_02.PNG'
import formBackground from '../../graphic/background_01.png'
import buttonBackground from '../../graphic/button_long_01.png'

import styled from "styled-components"

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
  
    height:100%;

    background-image: url(${wrapperBackground});
    background-size: cover;
    background-repeat: no-repeat;
`

const Form = styled.form`
    background-image: url(${formBackground});
    background-size: cover;
    background-repeat: no-repeat;

    width: 40%;

    color: white;
    text-shadow: 2px 1px #303433;
    border-radius: 20px;
    padding-top:20px;
    text-align: center;
`

const Input = styled.input`
    width: 80%;
    border: none;
    color: white;
    font-size: 1.7em;
    padding-left: 15px;
    padding-right: 15px;
    border-radius: 10px;
`

const Button = styled.button`
    background-image: url(${buttonBackground});
    background-size: cover;
    background-repeat: no-repeat;
    border-radius: 5px;
    font-size: 2rem;
    width:70%;
    border: none;
    color:white;
    margin-top:0.3rem;
    text-shadow: 2px 1px #303433;
    cursor: pointer ;
    margin: 10px;
`

const Label = styled.label`
    display:block;
    text-align:left;
    margin: 10px 0 0 50px;
`

class AuthForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            username: "",
            password: "",
            profileImageUrl: ""
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

        return (
            <Wrapper>
                <Form onSubmit={this.handleSubmit}>
                    <h2>{heading}</h2>
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
                    <Button type="submit">
                        {buttonText}
                    </Button>

                    {login && (<p>New here? <br /> You can signup <Link to="/register">here</Link></p>)}
                    {!login && (<p>Already signed up? <br />Login <Link to="/login">here</Link></p>)}
                </Form>
            </Wrapper>
        );
    }
}

export default AuthForm;