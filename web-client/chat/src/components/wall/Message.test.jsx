import React from "react";
import ReactDOM from "react-dom";
import { shallow, mount, render } from "enzyme";

import Message from "./Message";

describe("Message suite", function() {
  it("renders without crashing", () => {
    const div = document.createElement("div");
    const date = Date.now();
    ReactDOM.render(
      <Message
        avatar="http://example.com/image.jpg"
        time={date}
        message="I am a message."
      />,
      div
    );
  });

  it("allows us to set props", () => {
    const wrapper = mount(<Message message="test" />);
    expect(wrapper.props().message).toBe("test");
    wrapper.setProps({ message: "different message" });
    expect(wrapper.props().message).toBe("different message");
  });

  it("renders the avatar", () => {
    expect(
      shallow(
        <Message
          message="I am a message."
          avatar="http://example.com/image.jpg"
        />
      ).contains(
        <img
          className="media-object img-rounded"
          src="http://example.com/image.jpg"
          alt="avatar"
        />
      )
    ).toBe(true);
  });

  it("renders the time", () => {
    const date = Date.now();
    expect(
      shallow(<Message message="I am a message." time={date} />).contains(
        "a few seconds ago"
      )
    ).toBe(true);
  });

  it("renders the message", () => {
    expect(shallow(<Message message="I am a message." />).html()).toContain(
      "<p>I am a message.</p>"
    );
  });
});
