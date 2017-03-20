import React, { Component } from 'react';
import CreateMessage from './CreateMessage';
import Login from '../users/Login';
import Message from './Message';


class Wall extends Component {
  render() {
    return (
      <ol className="col-lg-12">
        {this.props.messages.map((message) =>
          <li key={message.key} className="list-group-item">
            <Message message={message.message} user={message.user.username} avatar={message.user.avatar} time={message.timestamp} />
          </li>
        )}
        <li className="list-group-item clearfix">
          {this.props.loggedIn ?
            <CreateMessage createMessage={this.props.createMessage} hasErrors={this.props.hasErrors} errors={this.props.errors} />
            :
            <Login doLogin={this.props.doLogin} hasErrors={this.props.hasErrors} errors={this.props.errors} />
          }
        </li>
      </ol>
    );
  }
}

export default Wall;
