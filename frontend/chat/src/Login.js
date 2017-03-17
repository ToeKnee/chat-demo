import React, { Component } from 'react';
import Warning from './Warning';

class Login extends Component {
  render() {
    return (
      <form className="well">

      <h2>Login</h2>

      {(this.props.hasErrors && this.props.errors.non_field_errors) ? (<Warning warning={this.props.errors.non_field_errors} />) : ""}

      <div className="form-group">
      <label htmlFor="username">Username*</label>
      <input type="text" name="username" className="form-control" />
        {(this.props.hasErrors && this.props.errors.username) ? (<Warning warning={this.props.errors.username} />) : ""}
      </div>

      <div className="form-group">
      <label htmlFor="password">Password*</label>
      <input type="password" name="password" className="form-control" />
        {(this.props.hasErrors && this.props.errors.password) ? (<Warning warning={this.props.errors.password} />) : ""}
      </div>

      <button className="btn btn-primary" onClick={ this.props.doLogin }>
        Log in
      </button>

      </form>
    );
  }
}

export default Login;
