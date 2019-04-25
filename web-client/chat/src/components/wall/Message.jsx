import React, { Component } from "react";
import ReactMarkdown from "react-markdown";
import moment from "moment";

import "./Message.scss";

class Message extends Component {
  render() {
    return (
      <div className="media">
        <div className="media-left">
          <img
            className="media-object img-rounded"
            src={this.props.avatar}
            alt="avatar"
          />
        </div>
        <div className="media-body">
          <div className="pull-right">{moment(this.props.time).fromNow()}</div>
          <h4 className="media-heading text-left">{this.props.user}</h4>

          <ReactMarkdown source={this.props.message} escapeHtml={true} />
        </div>
      </div>
    );
  }
}

export default Message;
