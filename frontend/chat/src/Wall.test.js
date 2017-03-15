import React from 'react';
import ReactDOM from 'react-dom';
import Wall from './Wall';

it('renders empty messages without crashing', () => {
  const div = document.createElement('div');
  const messages = [];
  ReactDOM.render(<Wall messages={messages} />, div);
});

it('renders  messages without crashing', () => {
  const div = document.createElement('div');
  const messages = [
    {
      "key": 1,
      "message": "It's a bit quiet in here",
      "user": {
        "username": "Anonymous",
        "avatar": "https://www.gravatar.com/avatar/40d9c9117dd26facbe8967fc0e516easd?d=mm"
      },
      "timestamp": "2017-03-15T12:02:24.401542Z"
    }
  ];
  ReactDOM.render(<Wall messages={messages} />, div);
});
