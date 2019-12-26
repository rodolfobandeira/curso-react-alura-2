import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import AutorBox from './Autor';
import LivroBox from './Livro';
import * as serviceWorker from './serviceWorker';
import './index.css';

ReactDOM.render(
  <Router>
    <App>
      <Route exact={true} path="/" />
      <Route path="/autor" component={AutorBox} />
      <Route path="/livro" component={LivroBox} />
    </App>
  </Router>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
