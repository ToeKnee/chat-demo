import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';


it('renders without crashing', () => {
  const fetchMock = require('fetch-mock');
  const div = document.createElement('div');

  fetchMock.get('/api/wall/', []);

  ReactDOM.render(<App />, div);

  fetchMock.restore();
});
