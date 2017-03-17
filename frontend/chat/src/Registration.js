import React, { Component } from 'react';
import Warning from './Warning';

class Registration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasErrors: false,
      errors: {
        username: null,
        email: null,
        password: null
      }

    };

    // Bind this to onClick handlers
    this.checkStatus = this.checkStatus.bind(this);
    this.doRegistration = this.doRegistration.bind(this);
  };

  checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      this.setState({hasErrors: false});
      return response;
    } else {
      this.setState({hasErrors: true});
      return response;
    }
  };

  doRegistration(e) {
    e.preventDefault();
    var form = document.querySelector('form');
    fetch((process.env.REACT_APP_BACKEND || "") + "/api/users/", {
      method: 'POST',
      body: new FormData(form)
    })
    .then(this.checkStatus)
    .then(response => response.json())
    .then(json => {
      if (this.state.hasErrors) {
        this.setState({errors: json});
      } else {
        this.props.doLogin();
      }

    }).catch(function(ex) {
      // Display this well
      console.log('parsing failed', ex)
    });

  };

  render() {
    return (
      <form className="well">

      <div className="form-group">
      <label>Name*</label>
      <input type="text" name="username" className="form-control" />
        {(this.state.hasErrors && this.state.errors.username) ? (<Warning warning={this.state.errors.username} />) : ""}
      </div>

      <div className="form-group">
      <label>Email</label>
      <input type="email" name="email" className="form-control" />
        {(this.state.hasErrors && this.state.errors.email) ? (<Warning warning={this.state.errors.email} />) : ""}
      </div>

      <div className="form-group">
      <label>Password*</label>
      <input type="password" name="password" className="form-control" />
        {(this.state.hasErrors && this.state.errors.password) ? (<Warning warning={this.state.errors.password} />) : ""}
      </div>

      <button className="btn btn-primary" onClick={ this.doRegistration }>
        Sign up
      </button>

      </form>
    );
  }
}

export default Registration;
