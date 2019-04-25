import React from "react";
import ReactDOM from "react-dom";
import { shallow, mount, render } from "enzyme";

import App from "./../App";
import Registration from "./Registration";

describe("Registration suite", function() {
  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<Registration />, div);
  });

  it("contains a username field", () => {
    expect(
      shallow(<Registration />).contains(
        <input type="text" name="username" className="form-control" />
      )
    ).toBe(true);
  });

  it("contains an email field", () => {
    expect(
      shallow(<Registration />).contains(
        <input type="password" name="password" className="form-control" />
      )
    ).toBe(true);
  });

  it("contains a password field", () => {
    expect(
      shallow(<Registration />).contains(
        <input type="password" name="password" className="form-control" />
      )
    ).toBe(true);
  });

  it("contains a Sign up button", () => {
    expect(
      shallow(<Registration />).contains(
        <button className="btn btn-primary" onClick={App.doRegistration}>
          Sign up
        </button>
      )
    ).toBe(true);
  });

  it("displays non field errors", () => {
    let errors = {
      non_field_errors: "Non-field error",
      username: "Username error",
      email: "Email error",
      password: "Password error"
    };
    expect(
      mount(<Registration hasErrors={true} errors={errors} />).contains(
        <div className="alert alert-danger" role="alert">
          Non-field error
        </div>
      )
    ).toBe(true);
  });

  it("displays username errors", () => {
    let errors = {
      non_field_errors: "Non-field error",
      username: "Username error",
      email: "Email error",
      password: "Password error"
    };
    expect(
      mount(<Registration hasErrors={true} errors={errors} />).contains(
        <div className="alert alert-danger" role="alert">
          Username error
        </div>
      )
    ).toBe(true);
  });

  it("displays email errors", () => {
    let errors = {
      non_field_errors: "Non-field error",
      username: "Username error",
      email: "Email error",
      password: "Password error"
    };
    expect(
      mount(<Registration hasErrors={true} errors={errors} />).contains(
        <div className="alert alert-danger" role="alert">
          Email error
        </div>
      )
    ).toBe(true);
  });

  it("displays password errors", () => {
    let errors = {
      non_field_errors: "Non-field error",
      username: "Username error",
      email: "Email error",
      password: "Password error"
    };
    expect(
      mount(<Registration hasErrors={true} errors={errors} />).contains(
        <div className="alert alert-danger" role="alert">
          Password error
        </div>
      )
    ).toBe(true);
  });
});
