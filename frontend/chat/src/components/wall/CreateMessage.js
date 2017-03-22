import React, { Component } from 'react';
import Warning from '../Warning';


class CreateMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message_text: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({message_text: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.createMessage(event);
    this.setState({"message_text": ""});
  }

  render() {
    return (
      <form onSubmit={(event) => this.handleSubmit(event)}>
        <div className="form-group">
          <textarea name="message" className="form-control" rows="3" value={this.state.message_text}  onChange={(event) => this.handleChange(event)} />
          {(this.props.hasErrors && this.props.errors.message) ? (<Warning warning={this.props.errors.message} />) : ""}
          {(this.props.hasErrors && this.props.errors.detail) ? (<Warning warning={this.props.errors.detail} />) : ""}
        </div>
        <button className="btn btn-primary pull-right">
          ⏎ Chat
        </button>
      </form>
    );
  }
}

export default CreateMessage;
