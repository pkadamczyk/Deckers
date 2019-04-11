import React, { Component } from "react";
import PropTypes from "prop-types";

class AuthForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      username: "",
      password: "",
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
      heading,
      buttonText,
    } = this.props;

    return (
      <div>
        <div className="row justify-content-md-center text-center">
          <div className="col-md-6">
            <form onSubmit={this.handleSubmit}>
              <h2>{heading}</h2>
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
                </div>
              )}
              <button
                type="submit"
                className="btn btn-primary btn-block btn-lg"
              >
                {buttonText}
              </button>
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
