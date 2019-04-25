import React from "react";
import ReactDOM from "react-dom";
import { shallow, mount, render } from "enzyme";

import CreateMessage from "./CreateMessage";
import Warning from "../Warning";

describe("CreateMessage suite", function() {
  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<CreateMessage />, div);
  });

  it("allows us to set props", () => {
    const wrapper = mount(<CreateMessage hasErrors={true} errors={{}} />);
    expect(wrapper.props().hasErrors).toBe(true);
    wrapper.setProps({ hasErrors: false });
    expect(wrapper.props().hasErrors).toBe(false);
  });

  it("contains a message text area", () => {
    const wrapper = mount(<CreateMessage />);
    expect(wrapper.html()).toContain(
      '<textarea name="message" class="form-control" rows="3"></textarea>'
    );
    wrapper.setState({ message_text: "Some text" });
    expect(wrapper.html()).toContain(
      '<textarea name="message" class="form-control" rows="3">Some text</textarea>'
    );
  });

  it("has message_text state", () => {
    const wrapper = mount(<CreateMessage />);
    expect(wrapper.state()).toMatchObject({ message_text: "" });
    wrapper.setState({ message_text: "Some text" });
    expect(wrapper.state()).toMatchObject({ message_text: "Some text" });
  });

  it("displays message errors", () => {
    const errors = {
      message: "Message error"
    };
    expect(
      shallow(<CreateMessage hasErrors={true} errors={errors} />).contains(
        <Warning warning="Message error" />
      )
    ).toBe(true);
  });

  it("displays detail errors", () => {
    const errors = {
      detail: "Detail error"
    };
    expect(
      shallow(<CreateMessage hasErrors={true} errors={errors} />).contains(
        <Warning warning="Detail error" />
      )
    ).toBe(true);
  });

  it("handles changes to the text area", () => {
    const wrapper = mount(<CreateMessage />);

    wrapper
      .find("textarea")
      .simulate("change", { target: { value: "I am a message" } });

    expect(wrapper.state()).toMatchObject({ message_text: "I am a message" });
  });

  it("handles form submit", () => {
    const createMessage = jest.fn();
    const wrapper = mount(<CreateMessage createMessage={createMessage} />);

    wrapper.setState({ message_text: "Some text" });
    wrapper.find("form").simulate("submit");

    expect(createMessage).toHaveBeenCalledTimes(1);
    expect(wrapper.state()).toMatchObject({ message_text: "" });
  });
});
