import Promise from 'promise-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import './index.scss';

// Add Promise to window for browsers that don't support it
if (!window.Promise) {
  window.Promise = Promise;
}

ReactDOM.render(<App />, document.getElementById('root'));
