import React, { Component } from "react";
import PropTypes from "prop-types";
import {Link} from 'react-router-dom';

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
    const authType = this.props.signUp ? "register" : "login";
    this.props
      .onAuth(authType, this.state)
      .then(() => {
        this.props.history.push("/");
      })
      .catch(() => {
        return;
      });
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const { email, username, password} = this.state;
    const {
      signUp,
      login,
      heading,
      buttonText,
    } = this.props;

    return (
      <div className="AuthFormWrapper">
        <div className="row justify-content-md-center text-center">
          <div className="AuthFormItself col-md-3">
            <form onSubmit={this.handleSubmit}>
              <h2>{heading}</h2>
              <label htmlFor="email">E-mail</label>
                <input
                  autoComplete="off"
                  className="form-control"
                  id="email"
                  name="email"
                  onChange={this.handleChange}
                  type="text"
                  value={email}
                />              
              <label htmlFor="password">Password</label>
              <input
                autoComplete="off"
                className="form-control"
                id="password"
                name="password"
                onChange={this.handleChange}
                type="password"
                value={password}
              />
              {signUp && (
                <div>
                  <label htmlFor="username">Username</label>
                  <input
                    autoComplete="off"
                    className="form-control"
                    id="username"
                    name="username"
                    onChange={this.handleChange}
                    type="text"
                    value={username}
                  />
                </div>
              )}
              <button
                type="submit"
                className="btn btn-block btn-lg mt-3"
              >
                {buttonText}
              </button>
              {login && (<p className="mt-4">New here? Please signup <Link to="/register">here</Link></p>)}
              {signUp && (<p className="mt-2">Already signed up? Login <Link to="/login">here</Link></p>)}
            </form>
          </div>
        </div>
      </div>
    );
  }
}
AuthForm.propTypes = {
  buttonText: PropTypes.string,
  heading: PropTypes.string,
  history: PropTypes.object,
  onAuth: PropTypes.func,
  signIn: PropTypes.bool
};

export default AuthForm;