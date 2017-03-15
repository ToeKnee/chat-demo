import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import Promise from 'promise-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

// Add Promise to window for browsers that don't support it
if (!window.Promise) {
  window.Promise = Promise;
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
