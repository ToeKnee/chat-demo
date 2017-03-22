import React, { Component } from 'react';
import moment from 'moment';

class Message extends Component {
  render() {
    return (
      <div className="media">
        <div className="media-left">
          <img className="media-object img-rounded" src={this.props.avatar} alt="avatar" />
        </div>
        <div className="media-body">
          <div className="pull-right">{moment(this.props.time).fromNow()}</div>
          <h4 className="media-heading text-left">
            {this.props.user}
          </h4>

          <p>
            {this.props.message}
          </p>

        </div>
      </div>
    );
  }
}

export default Message;
