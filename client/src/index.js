import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {Dashboard} from "./components/dashboard/Dashboard"
import { BrowserRouter, Route, Switch } from 'react-router-dom';

ReactDOM.render(
  
  <React.StrictMode>
    <div className="wrapper">
      <div className={"main-title"}>
        <div className={"title"}>SC2 Monobattle Calculator</div>
          <div>Purpose</div>
          <div>contact</div>

        
      </div>
      
      <BrowserRouter>
        <Switch>
          <Route path="/dash">
            <Dashboard />
          </Route>
          <Route path="/">
            <App />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
