import React, { Component } from 'react';
import './App.css';
import Wall from './Wall';

class App extends Component {
    constructor(props) {
        super(props);
        this.timer = null;
        this.state = {
            messages: [
                {
                    "key": 1,
                    "message": "It's a bit quiet in here",
                    "user": {
                        "username": "Anonymous",
                        "avatar": "https://www.gravatar.com/avatar/40d9c9117dd26facbe8967fc0e516easd?d=mm"
                    },
                    "timestamp": "2017-03-15T19:02:24.401542Z"
                }
            ]
        };
    };

    loadMessages() {
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
    };

    componentDidMount() {
        this.loadMessages();
        this.timer = setInterval(function() {this.loadMessages();}.bind(this), 5000)
    };

    componentWillUnmount() {
        clearInterval(this.timer);
    };

    render() {
        return (
            <div className="App">
            <div className="App-header">
            <h2>Welcome to Chat Wall</h2>
            </div>
            <div className="container">
            <Wall messages={this.state.messages} />
            </div>
            </div>
        );
    };
}

export default App;
