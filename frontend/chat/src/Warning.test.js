import React from 'react';
import ReactDOM from 'react-dom';
import Warning from './Warning';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Warning />, div);
});
