import React, { Component } from 'react';
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
            </ol>
        );
    }
}

export default Wall;
