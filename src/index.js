import React from 'react';
import { render } from 'react-dom';
import DevTools from 'mobx-react-devtools';
import App from './containers/app';
import './main.scss';

import Store from './store';

window.store = new Store();

window.config = require('./configs/config.json');

window.DEVELOPMENT = process.env.NODE_ENV === 'development';
console.log(DEVELOPMENT);

render(
  <div id="app">
    {DEVELOPMENT && <DevTools />}
    <App />
  </div>,
  document.body.appendChild(document.createElement('div'))
);
