import React from "react";
import ReactDOM from "react-dom";
import { shallow, mount, render } from "enzyme";

import Warning from "./Warning";

describe("Warning suite", function() {
  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<Warning />, div);
  });

  it("allows us to set props", () => {
    const wrapper = mount(<Warning warning="test" />);
    expect(wrapper.props().warning).toBe("test");
    wrapper.setProps({ warning: "different warning" });
    expect(wrapper.props().warning).toBe("different warning");
  });

  it("renders the warning", () => {
    expect(
      shallow(<Warning warning="A warning message." />).contains(
        <div className="alert alert-danger" role="alert">
          A warning message.
        </div>
      )
    ).toBe(true);
  });
});
