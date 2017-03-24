import React, { Component } from 'react';
import './App.css';
import Login from './users/Login';
import Registration from './users/Registration';
import Wall from './wall/Wall';
import Warning from './Warning';

class App extends Component {
  constructor(props) {
    super(props);
    this.timer = undefined;
    this.state = {
      messages: [
        {
          "key": 1,
          "message": "It's a bit quiet in here...",
          "user": {
            "username": "Chat Wall",
            "avatar": "https://www.gravatar.com/avatar/40d9c9117dd26facbe8967fc0e516easd?d=mm"
          },
          "timestamp": "2017-03-15T19:02:24.401542Z"
        }
      ],
      // Log-in Token
      token: localStorage.token,

      // Store error state
      hasErrors: false,
      errors: {},

      // Which screen are we showing?
      display: "wall"
    };

    // Bind this to onClick handlers
    this.checkStatus = this.checkStatus.bind(this);
    this.createMessage = this.createMessage.bind(this);
    this.doLogin = this.doLogin.bind(this);
    this.doLogout = this.doLogout.bind(this);
    this.doRegistration = this.doRegistration.bind(this);
    this.handleError = this.handleError.bind(this);
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleRegisterClick = this.handleRegisterClick.bind(this);
  };

  handleError(exception) {
    // Log the exception in some way.
    //
    // Maybe save it in local storage and sync it back to the server
    // when possible.

    // Display a friendly error message
    this.setState({
      hasErrors: true,
      errors: {
        global: "Uh-oh. Something went wrong. Please check " +
        "your internet connection. If the problem still persists, " +
        "please contact us."
      }
    });
  }

  loadMessages() {
    if (this.state.display === "wall") {
      return fetch((process.env.REACT_APP_BACKEND || "") + "/api/wall/")
      .then(this.checkStatus)
      .then(response => response.json())
      .then(json => {
        this.setState({
          messages: json
        });
      }).catch(this.handleError);
    }
  };

  componentDidMount() {
    this.loadMessages();
    this.timer = setInterval(function() {this.loadMessages();}.bind(this), 5000);
  };

  componentWillUnmount() {
    clearInterval(this.timer);
    this.timer = undefined;
  };

  handleRegisterClick(e) {
    e.preventDefault();
    this.setState({display: "registration"});
  };

  handleLoginClick(e) {
    e.preventDefault();
    this.setState({display: "login"});
  };

  checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      this.setState({
        hasErrors: false,
        errors: {}
      });
      return response;
    } else {
      this.setState({hasErrors: true});
      return response;
    }
  };

  doRegistration(e) {
    e.preventDefault();
    var form = document.querySelector('form');
    return fetch((process.env.REACT_APP_BACKEND || "") + "/api/users/", {
      method: 'POST',
      body: new FormData(form)
    })
    .then(this.checkStatus)
    .then(response => response.json())
    .then(json => {
      if (this.state.hasErrors) {
        this.setState({errors: json});
      } else {
        this.doLogin();
      }
    }).catch(this.handleError);
  };

  doLogin(e) {
    // This can be called by doRegistration or by an onClick event.
    if (typeof e !== "undefined") {
      e.preventDefault();
    }
    // Get the log-in token
    var form = document.querySelector('form');
    return fetch((process.env.REACT_APP_BACKEND || "") + "/api/users/token/", {
      method: 'POST',
      body: new FormData(form)
    })
    .then(this.checkStatus)
    .then(response => response.json())
    .then(json => {
      if (this.state.hasErrors) {
        this.setState({
          errors: json,
          token: undefined
        });
        localStorage.token = undefined;
      } else if (typeof json.token !== "undefined") {
        localStorage.token = json.token;
        this.setState({
          token: json.token,
          display: "wall"
        });
      }
    }).catch(this.handleError);
  };

  doLogout() {
    localStorage.removeItem("token");
    this.setState({
      token: undefined,
      display: "wall"
    });
  };

  createMessage(e, message_text) {
    e.preventDefault();
    return fetch((process.env.REACT_APP_BACKEND || "") + "/api/wall/", {
      method: 'POST',
      headers: {
        'Authorization': "Token " + this.state.token,
        'HTTP_Authorization': "Token " + this.state.token,
        'origin': "Token " + this.state.token,
        'content-type': "application/json"
      },
      body: JSON.stringify({
        "message": message_text
      })
    })
    .then(this.checkStatus)
    .then(response => response.json())
    .then(json => {
      if (this.state.hasErrors) {
        this.setState({errors: json});
      } else {
        // Load the message list
        this.loadMessages();
      }
    }).catch(this.handleError);
  };

  loggedIn() {
    return typeof this.state.token !== "undefined";
  };

  render() {
    let body = null;

    switch (this.state.display) {
      case "wall": {
        body = <Wall messages={this.state.messages} loggedIn={this.loggedIn()} createMessage={this.createMessage} doLogin={this.doLogin} hasErrors={this.state.hasErrors} errors={this.state.errors} />;
        break;
      }
      case "registration": {
        body = <Registration doRegistration={this.doRegistration} hasErrors={this.state.hasErrors} errors={this.state.errors} />;
        break;
      }
      case "login": {
        body = <Login doLogin={this.doLogin} hasErrors={this.state.hasErrors} errors={this.state.errors} />;
        break;
      }
      default: {
        body = <Wall messages={this.state.messages} loggedIn={this.loggedIn()} createMessage={this.createMessage} doLogin={this.doLogin} hasErrors={this.state.hasErrors} errors={this.state.errors} />;
        break;
      }
    };

    return (
      <div className="App">
        <div className="App-header">
          <div className="pull-right">
            {typeof this.state.token === "undefined" ? (
                <div>
                <button className="btn btn-default" onClick={this.handleRegisterClick}>
                  Create Account
                </button> &nbsp;
                <button className="btn btn-primary" onClick={this.handleLoginClick}>Log in</button>
                </div>
            ) : (<button className="btn btn-default btn-sm"  onClick={this.doLogout}>Logout</button>)
            }
          </div>
          <h2>Welcome to Chat Wall</h2>
        </div>
        <div className="container">
          {(this.state.hasErrors && this.state.errors.global) ? (<Warning warning={this.state.errors.global} />) : ""}
          {body}
        </div>
      </div>
    );
  };
}

export default App;
