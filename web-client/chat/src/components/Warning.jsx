import React, { Component } from "react";

class Warning extends Component {
  render() {
    return (
      <div className="alert alert-danger" role="alert">
        {this.props.warning}
      </div>
    );
  }
}

export default Warning;
