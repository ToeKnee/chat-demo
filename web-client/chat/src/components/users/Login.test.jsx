import React from "react";
import ReactDOM from "react-dom";
import { shallow, mount, render } from "enzyme";

import App from "./../App";
import Login from "./Login";

describe("Login suite", function() {
  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<Login />, div);
  });

  it("contains a username field", () => {
    expect(
      shallow(<Login />).contains(
        <input type="text" name="username" className="form-control" />
      )
    ).toBe(true);
  });

  it("contains a password field", () => {
    expect(
      shallow(<Login />).contains(
        <input type="password" name="password" className="form-control" />
      )
    ).toBe(true);
  });

  it("contains a Log in button", () => {
    expect(
      shallow(<Login />).contains(
        <button className="btn btn-primary" onClick={App.doLogin}>
          Log in
        </button>
      )
    ).toBe(true);
  });

  it("displays non field errors", () => {
    let errors = {
      non_field_errors: "Non-field error",
      username: "Username error",
      password: "Password error"
    };
    expect(
      mount(<Login hasErrors={true} errors={errors} />).contains(
        <div className="alert alert-danger" role="alert">
          Non-field error
        </div>
      )
    ).toBe(true);
  });

  it("displays userame errors", () => {
    let errors = {
      non_field_errors: "Non-field error",
      username: "Username error",
      password: "Password error"
    };
    expect(
      mount(<Login hasErrors={true} errors={errors} />).contains(
        <div className="alert alert-danger" role="alert">
          Username error
        </div>
      )
    ).toBe(true);
  });

  it("displays password errors", () => {
    let errors = {
      non_field_errors: "Non-field error",
      username: "Username error",
      password: "Password error"
    };
    expect(
      mount(<Login hasErrors={true} errors={errors} />).contains(
        <div className="alert alert-danger" role="alert">
          Password error
        </div>
      )
    ).toBe(true);
  });
});
