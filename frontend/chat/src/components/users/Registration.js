import React, { Component } from 'react';
import Warning from '../Warning';

class Registration extends Component {
  render() {
    return (
      <form className="well">

      <h2>Create Account</h2>

      <div className="form-group">
      <label htmlFor="username">Username*</label>
      <input type="text" name="username" className="form-control" />
        {(this.props.hasErrors && this.props.errors.username) ? (<Warning warning={this.props.errors.username} />) : ""}
      </div>

      <div className="form-group">
      <label htmlFor="email">Email</label>
      <input type="email" name="email" className="form-control" />
        {(this.props.hasErrors && this.props.errors.email) ? (<Warning warning={this.props.errors.email} />) : ""}
      </div>

      <div className="form-group">
      <label htmlFor="password">Password*</label>
      <input type="password" name="password" className="form-control" />
        {(this.props.hasErrors && this.props.errors.password) ? (<Warning warning={this.props.errors.password} />) : ""}
      </div>

      <button className="btn btn-primary" onClick={ this.props.doRegistration }>
        Sign up
      </button>

      </form>
    );
  }
}

export default Registration;
