import React from "react";
import ReactDOM from "react-dom";
import TestUtils from "react-dom/test-utils";
import { shallow, mount, render } from "enzyme";
import fetchMock from "fetch-mock";
import sinon from "sinon";

import App from "./App";
import Login from "./users/Login";
import Registration from "./users/Registration";
import Wall from "./wall/Wall";
import Warning from "./Warning";

const querySelector = sinon.stub(document, "querySelector");

describe("App handleError suite", () => {
  it("sets a friendly error message", () => {
    const wrapper = shallow(<App />);

    const exception = {};
    wrapper.instance().handleError(exception);

    expect(wrapper.state().hasErrors).toBe(true);
    expect(wrapper.state().errors).toMatchObject({
      global:
        "Uh-oh. Something went wrong. Please check " +
        "your internet connection. If the problem still persists, " +
        "please contact us."
    });
  });
});

describe("App loadMessages suite", () => {
  afterEach(() => {
    fetchMock.reset();
    fetchMock.restore();
  });

  it("does not set messages if array is empty", async () => {
    const test_messages = [];
    fetchMock.get("/api/wall/", {
      status: 200,
      body: JSON.stringify(test_messages)
    });

    const wrapper = shallow(<App />);

    await wrapper.instance().loadMessages();

    expect(wrapper.state().messages).toMatchObject([
      {
        key: 1,
        message: "It's a bit quiet in here...",
        user: {
          username: "Chat Wall",
          avatar:
            "https://www.gravatar.com/avatar/40d9c9117dd26facbe8967fc0e516easd?d=mm"
        },
        timestamp: "2017-03-15T19:02:24.401542Z"
      }
    ]);
  });

  it("sets messages to the correct value", async () => {
    const test_messages = [
      {
        key: 1,
        message: "Mocked message",
        user: {
          username: "Chat Wall",
          avatar:
            "https://www.gravatar.com/avatar/40d9c9117dd26facbe8967fc0e516easd?d=mm"
        },
        timestamp: "2017-03-15T19:02:24.401542Z"
      }
    ];
    fetchMock.get("/api/wall/", {
      status: 200,
      body: JSON.stringify(test_messages)
    });

    const wrapper = shallow(<App />);

    await wrapper.instance().loadMessages();

    expect(wrapper.state().messages).toMatchObject(test_messages);
  });
});

describe("App componentDidMount suite", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("sets a timer to call loadMessages", () => {
    const wrapper = shallow(<App />);

    let test_response = wrapper.instance().componentDidMount();
    expect(typeof wrapper.instance().timer).toBe("number");
    expect(setInterval.mock.calls.length).toBeGreaterThanOrEqual(1);
    expect(setInterval.mock.calls[0][1]).toBe(5000);
  });
});

describe("App componentWillUnmount suite", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("clears the timer", () => {
    const wrapper = shallow(<App />);
    wrapper.timer = setInterval(() => {}, 500);
    let test_response = wrapper.instance().componentWillUnmount();
    expect(typeof wrapper.instance().timer).toBe("undefined");
  });
});

describe("App handleRegisterClick suite", () => {
  it("sets display to registration", () => {
    const wrapper = shallow(<App />);
    wrapper.setState({
      display: "wall"
    });

    const event = new Event("click");
    let test_response = wrapper.instance().handleRegisterClick(event);
    expect(wrapper.state().display).toBe("registration");
  });
});

describe("App handleLoginClick suite", () => {
  it("sets display to login", () => {
    const wrapper = shallow(<App />);
    wrapper.setState({
      display: "wall"
    });

    const event = new Event("click");
    let test_response = wrapper.instance().handleLoginClick(event);
    expect(wrapper.state().display).toBe("login");
  });
});

describe("App checkStatus suite", () => {
  it("sets hasErrors to false and returns the response for 2** responses", () => {
    const wrapper = shallow(<App />);

    for (let i = 200; i < 300; i++) {
      wrapper.setState({
        hasErrors: true,
        errors: { detail: "An error" }
      });
      let response = {
        status: i
      };
      let test_response = wrapper.instance().checkStatus(response);
      expect(test_response).toMatchObject(response);
      expect(wrapper.state().hasErrors).toBe(false);
      expect(wrapper.state().errors).toMatchObject({});
    }
  });

  it("sets hasErrors to true and returns the response for error responses", () => {
    const wrapper = shallow(<App />);

    const sample_of_errors = [301, 401, 403, 500];
    for (let i = 0; i < sample_of_errors.length; i++) {
      wrapper.setState({
        hasErrors: false,
        errors: { detail: "An error" }
      });
      let response = {
        status: sample_of_errors[i]
      };
      let test_response = wrapper.instance().checkStatus(response);
      expect(test_response).toMatchObject(response);
    }
  });
});

describe("App doRegistration suite", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useFakeTimers();
    fetchMock.reset();
    fetchMock.restore();
    sinon.stub.reset();
  });

  it("submits the form", async () => {
    fetchMock
      .get("/api/wall/", {
        status: 200,
        body: JSON.stringify([])
      })
      .post("/api/users/", {
        status: 200,
        body: JSON.stringify({
          username: "My-Username",
          email: "my@email.com"
        })
      });
    fetchMock.post("/api/users/token/", {
      status: 200,
      body: JSON.stringify({
        token: "my-token"
      })
    });

    const form = document.createElement("form");
    const username_input = document.createElement("input", {
      name: "username",
      value: "My-Username"
    });
    form.appendChild(username_input);
    const email_input = document.createElement("input", {
      name: "email",
      value: "my@email.com"
    });
    form.appendChild(email_input);
    const password_input = document.createElement("input", {
      name: "password",
      value: "My-Password"
    });
    form.appendChild(password_input);
    querySelector.returns(form);

    const wrapper = shallow(<App />);

    const event = new Event("submit");
    await wrapper.instance().doRegistration(event);

    expect(JSON.stringify(fetchMock.calls("/api/users/"))).toEqual(
      JSON.stringify([
        ["/api/users/", { method: "POST", body: new FormData(form) }]
      ])
    );
    expect(localStorage.token).toBe(undefined);
    expect(wrapper.state().token).toBe(undefined);
    // Logging in returns you to the wall
    expect(wrapper.state().display).toBe("wall");
  });
});

describe("App doLogin suite", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.runAllImmediates();
  });

  afterEach(() => {
    jest.useFakeTimers();
    fetchMock.reset();
    fetchMock.restore();
    sinon.stub.reset();
  });

  it("sets the token to the correct value", async () => {
    fetchMock
      .get("/api/wall/", {
        status: 200,
        body: JSON.stringify([])
      })
      .post("/api/users/token/", {
        status: 200,
        body: JSON.stringify({
          token: "my-token"
        })
      });

    const form = document.createElement("form");
    const username_input = document.createElement("input", {
      name: "username",
      value: "My-Username"
    });
    form.appendChild(username_input);
    const password_input = document.createElement("input", {
      name: "password",
      value: "My-Password"
    });
    form.appendChild(password_input);
    querySelector.returns(form);

    const wrapper = shallow(<App />);

    const event = new Event("submit");
    await wrapper.instance().doLogin(event);

    expect(localStorage.token).toBe("my-token");
    expect(wrapper.state().token).toBe("my-token");
    // Logging in returns you to the wall
    expect(wrapper.state().display).toBe("wall");
  });

  it("sets specific errors", async () => {
    fetchMock
      .get("/api/wall/", {
        status: 200,
        body: JSON.stringify([])
      })
      .post("/api/users/token/", {
        status: 401,
        body: JSON.stringify({
          details: "Not authorized"
        })
      });

    const form = document.createElement("form");
    const username_input = document.createElement("input", {
      name: "username",
      value: "My-Username"
    });
    form.appendChild(username_input);
    const password_input = document.createElement("input", {
      name: "password",
      value: "My-Password"
    });
    form.appendChild(password_input);
    querySelector.returns(form);

    const wrapper = shallow(<App />);

    const event = new Event("submit");
    await wrapper.instance().doLogin(event);

    expect(JSON.stringify(fetchMock.calls("/api/users/token/"))).toEqual(
      JSON.stringify([
        ["/api/users/token/", { method: "POST", body: new FormData(form) }]
      ])
    );
    expect(localStorage.token).toBe("undefined");
    expect(wrapper.state().token).toBe(undefined);
    expect(wrapper.state().hasErrors).toBe(true);
    expect(wrapper.state().errors).toMatchObject({ details: "Not authorized" });
  });
});

describe("App doLogout suite", () => {
  it("sets the token to undefined", () => {
    const wrapper = shallow(<App />);

    localStorage.setItem("token", "my-token");
    wrapper.setState({
      token: localStorage.token,
      display: "login"
    });

    wrapper.instance().doLogout();

    expect(localStorage.token).toBe(undefined);
    expect(wrapper.state().token).toBe(undefined);
    // Logging out returns you to the wall
    expect(wrapper.state().display).toBe("wall");
  });
});

describe("App createMessage suite", () => {
  afterEach(() => {
    fetchMock.reset();
    fetchMock.restore();
  });

  it("creates a message", async () => {
    fetchMock.get("/api/wall/", {
      status: 200,
      body: JSON.stringify([])
    });
    fetchMock.post("/api/wall/", {
      status: 200,
      body: JSON.stringify({
        message: "I am a message."
      })
    });

    const wrapper = shallow(<App />);
    wrapper.setState({
      token: "my-token"
    });

    wrapper.type.prototype.loadMessages = jest.fn();

    const event = new Event("submit");
    await wrapper.instance().createMessage(event, "I am a message");

    expect(fetchMock.called("/api/wall/")).toBe(true);
    expect(JSON.stringify(fetchMock.calls("/api/wall/"))).toEqual(
      JSON.stringify([
        ["/api/wall/", undefined],
        [
          // The Post to create the message
          "/api/wall/",
          {
            method: "POST",
            headers: {
              Authorization: "Token my-token",
              HTTP_Authorization: "Token my-token",
              origin: "Token my-token",
              "content-type": "application/json"
            },
            body: '{"message":"I am a message"}'
          }
        ],
        [
          // Load messages is called after create message
          "/api/wall/",
          undefined
        ]
      ])
    );
  });

  it("sets specific errors", async () => {
    fetchMock
      .get("/api/wall/", {
        status: 200,
        body: JSON.stringify([])
      })
      .post("/api/wall/", {
        status: 403,
        body: JSON.stringify({
          details: "No auth token"
        })
      });

    const wrapper = shallow(<App />);
    wrapper.type.prototype.loadMessages = jest.fn();

    const event = new Event("submit");
    await wrapper.instance().createMessage(event, "I am a message");

    expect(fetchMock.called("/api/wall/")).toBe(true);
    expect(JSON.stringify(fetchMock.calls("/api/wall/"))).toEqual(
      JSON.stringify([
        ["/api/wall/", undefined],
        [
          "/api/wall/",
          {
            method: "POST",
            headers: {
              Authorization: "Token undefined",
              HTTP_Authorization: "Token undefined",
              origin: "Token undefined",
              "content-type": "application/json"
            },
            body: '{"message":"I am a message"}'
          }
        ]
      ])
    );

    expect(wrapper.state().hasErrors).toBe(true);
    expect(wrapper.state().errors).toMatchObject({ details: "No auth token" });
  });
});

describe("App loggedIn suite", () => {
  it("returns true if token present", () => {
    const wrapper = shallow(<App />);
    wrapper.setState({
      token: "my-token"
    });
    expect(wrapper.instance().loggedIn()).toBe(true);
  });

  it("returns false if token is undefined", () => {
    const wrapper = shallow(<App />);
    wrapper.setState({
      token: undefined
    });
    expect(wrapper.instance().loggedIn()).toBe(false);
  });
});

describe("App render suite", () => {
  afterEach(() => {
    fetchMock.reset();
    fetchMock.restore();
  });

  it("renders without crashing", () => {
    fetchMock.get("/api/wall/", {
      status: 200,
      body: []
    });
    const div = document.createElement("div");
    ReactDOM.render(<App />, div);
  });

  it("renders the wall component", () => {
    fetchMock.get("/api/wall/", {
      status: 200,
      body: []
    });
    const component = TestUtils.renderIntoDocument(<App />);
    component.setState({ display: "wall", token: "my-token" });

    TestUtils.findRenderedComponentWithType(component, Wall);
  });

  it("renders the registration component", () => {
    fetchMock.get("/api/wall/", {
      status: 200,
      body: []
    });
    const component = TestUtils.renderIntoDocument(<App />);
    component.setState({ display: "registration" });

    TestUtils.findRenderedComponentWithType(component, Registration);
  });

  it("renders the login component", () => {
    fetchMock.get("/api/wall/", {
      status: 200,
      body: []
    });
    const component = TestUtils.renderIntoDocument(<App />);
    component.setState({ display: "login" });

    TestUtils.findRenderedComponentWithType(component, Login);
  });

  it("falls back to rendering the wall component", () => {
    fetchMock.get("/api/wall/", {
      status: 200,
      body: []
    });
    const component = TestUtils.renderIntoDocument(<App />);
    component.setState({ display: "fallback", token: "my-token" });

    TestUtils.findRenderedComponentWithType(component, Wall);
  });

  it("renders global errors", () => {
    const wrapper = shallow(<App />);
    wrapper.setState({
      hasErrors: true,
      errors: { global: "Global error" }
    });

    expect(wrapper.contains(<Warning warning="Global error" />)).toBe(true);
  });

  it("renders login and register buttons", () => {
    const wrapper = shallow(<App />);
    wrapper.setState({ token: undefined });
    expect(wrapper.html()).toContain(
      '<button class="btn btn-default">Create Account</button>'
    );
    expect(wrapper.html()).toContain(
      '<button class="btn btn-primary">Log in</button>'
    );
  });

  it("renders logout button", () => {
    const wrapper = shallow(<App />);
    wrapper.setState({ token: "my-token" });
    expect(wrapper.html()).toContain(
      '<button class="btn btn-default btn-sm">Logout</button>'
    );
  });
});
