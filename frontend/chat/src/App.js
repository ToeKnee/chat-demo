import React, { Component } from 'react';
import './App.css';
import Login from './Login';
import Registration from './Registration';
import Wall from './Wall';

class App extends Component {
  constructor(props) {
    super(props);
    this.timer = null;
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
    this.doLogin = this.doLogin.bind(this);
    this.doLogout = this.doLogout.bind(this);
    this.doRegistration = this.doRegistration.bind(this);
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleRegisterClick = this.handleRegisterClick.bind(this);
  };

  loadMessages() {
    if (this.state.display === "wall") {
      fetch((process.env.REACT_APP_BACKEND || "") + "/api/wall/")
      .then(response => response.json())
      .then(json => {
        this.setState({
          messages: json,
        });
      }).catch(function(ex) {
        // Display this well
        console.log('parsing failed', ex)
      });
    }
  };

  componentDidMount() {
    this.loadMessages();
    this.timer = setInterval(function() {this.loadMessages();}.bind(this), 5000)
  };

  componentWillUnmount() {
    clearInterval(this.timer);
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
        this.doLogin();
      }

    }).catch(function(ex) {
      // Display this well
      console.log('parsing failed', ex)
    });
  };

  doLogin(e) {
    // This can be called by doRegistration or by an onClick event.
    if (typeof e !== "undefined") {
      e.preventDefault();
    }
    // Get the log-in token
    var form = document.querySelector('form');
    fetch((process.env.REACT_APP_BACKEND || "") + "/api/users/token/", {
      method: 'POST',
      body: new FormData(form)
    })
    .then(this.checkStatus)
    .then(response => response.json())
    .then(json => {
      if (this.state.hasErrors) {
        this.setState({errors: json});
      } else if (typeof json.token !== "undefined") {
        localStorage.token = json.token;
        this.setState({
          token: json.token,
          display: "wall"
        });
      }
    }).catch(function(ex) {
      // Display this well
      console.log('parsing failed', ex)
    });
  };

  doLogout() {
    localStorage.removeItem("token");
    this.setState({
      token: undefined,
      display: "wall"
    });
  };

  render() {
    let body = null;
    switch (this.state.display) {
    case "wall": {
        body = <Wall messages={this.state.messages} />;
        break;
      }
      case "registration": {
        body =  <Registration doRegistration={this.doRegistration} hasErrors={this.state.hasErrors} errors={this.state.errors} />;
        break;
      }
    case "login": {
        body =  <Login doLogin={this.doLogin} hasErrors={this.state.hasErrors} errors={this.state.errors} />;
        break;
      }
      default: {
        body = <Wall messages={this.state.messages} />;
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
          {body}
        </div>
      </div>
    );
  };
}

export default App;
