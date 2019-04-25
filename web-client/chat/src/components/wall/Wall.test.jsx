import React from "react";
import ReactDOM from "react-dom";
import { shallow, mount, render } from "enzyme";
import moment from "moment";

import CreateMessage from "./CreateMessage";
import Login from "../users/Login";
import Wall from "./Wall";

describe("Wall suite", function() {
  it("renders empty messages without crashing", () => {
    const div = document.createElement("div");
    const messages = [];
    ReactDOM.render(<Wall messages={messages} />, div);
  });

  it("renders messages without crashing", () => {
    const messages = [
      {
        key: 1,
        message: "It's a bit quiet in here",
        user: {
          username: "Anonymous",
          avatar:
            "https://www.gravatar.com/avatar/40d9c9117dd26facbe8967fc0e516easd?d=mm"
        },
        timestamp: "2017-03-15T12:02:24.401542Z"
      },
      {
        key: 2,
        message: "Oh no it isn't...",
        user: {
          username: "A.n. Other",
          avatar:
            "https://www.gravatar.com/avatar/40d9c9117dd26facbe8967fc0e516easd?d=mm"
        },
        timestamp: "2017-03-16T13:03:25.401542Z"
      }
    ];
    const wrapper = mount(<Wall messages={messages} />);
    // Message 1
    expect(
      wrapper.contains(<h4 className="media-heading text-left">Anonymous</h4>)
    ).toBe(true);
    expect(
      wrapper.contains(
        <img
          className="media-object img-rounded"
          src="https://www.gravatar.com/avatar/40d9c9117dd26facbe8967fc0e516easd?d=mm"
          alt="avatar"
        />
      )
    ).toBe(true);
    expect(
      wrapper.contains(
        <div className="pull-right">
          {moment(messages[0].timestamp).fromNow()}
        </div>
      )
    ).toBe(true);
    expect(wrapper.contains(<p>It&#39;s a bit quiet in here</p>)).toBe(true);
    // Message 2
    expect(
      wrapper.contains(<h4 className="media-heading text-left">A.n. Other</h4>)
    ).toBe(true);
    expect(
      wrapper.contains(
        <img
          className="media-object img-rounded"
          src="https://www.gravatar.com/avatar/40d9c9117dd26facbe8967fc0e516easd?d=mm"
          alt="avatar"
        />
      )
    ).toBe(true);
    expect(
      wrapper.contains(
        <div className="pull-right">
          {moment(messages[1].timestamp).fromNow()}
        </div>
      )
    ).toBe(true);
    expect(wrapper.contains(<p>Oh no it isn't...</p>)).toBe(true);
  });

  it("allows us to set props", () => {
    const wrapper = mount(<Wall loggedIn={true} messages={[]} />);
    expect(wrapper.props().loggedIn).toBe(true);
    wrapper.setProps({ loggedIn: false });
    expect(wrapper.props().loggedIn).toBe(false);
  });

  it("renders create message component if logged in", () => {
    const wrapper = shallow(
      <Wall
        loggedIn={true}
        messages={[]}
        createMessage={[undefined]}
        hasErrors={[undefined]}
        errors={[undefined]}
      />
    );
    expect(
      wrapper.contains(
        <CreateMessage
          createMessage={[undefined]}
          hasErrors={[undefined]}
          errors={[undefined]}
        />
      )
    ).toBe(true);
    expect(
      wrapper.contains(
        <Login
          doLogin={[undefined]}
          hasErrors={[undefined]}
          errors={[undefined]}
        />
      )
    ).toBe(false);
  });

  it("renders log in component if logged out", () => {
    const wrapper = shallow(
      <Wall
        loggedIn={false}
        messages={[]}
        doLogin={[undefined]}
        createMessage={[undefined]}
        hasErrors={[undefined]}
        errors={[undefined]}
      />
    );
    expect(
      wrapper.contains(
        <Login
          doLogin={[undefined]}
          hasErrors={[undefined]}
          errors={[undefined]}
        />
      )
    ).toBe(true);
    expect(
      wrapper.contains(
        <CreateMessage
          createMessage={[undefined]}
          hasErrors={[undefined]}
          errors={[undefined]}
        />
      )
    ).toBe(false);
  });
});
