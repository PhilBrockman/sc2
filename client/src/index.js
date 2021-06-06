import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {Dashboard} from "./components/dashboard/Dashboard"
import { BrowserRouter, Route, Switch } from 'react-router-dom';

const Purpose = () => <div className="App">
  <div className={"container middle"}>
    <h1> Purpose </h1> 
      <div>Calculate the number of shots needed to take out a given unit. </div>
    <h1>Usage</h1>
      <ul>
        <li>Select an attacker and defender.</li>
        <li>Select upgrades (if desired).</li>
        <li>Select starting health/shields.</li>
      </ul>
    <div>Calculations are based off <a href="https://liquipedia.net/starcraft2/Damage_Calculation#:~:text=Performing%20the%20Calculations%5Bedit%5D,*Splash*Hallucinated*Prismatic.&text=Defense%20Available%3A%20If%20the%20defender,Points%2C%20this%20equals%20Shield%20Defense.">this resource</a></div>
  </div>
</div>

ReactDOM.render(
  
  <React.StrictMode>
    <div className="wrapper">
      <div className={"main-title"}>
        <div className={"title"}><a href = "/">SC2 Monobattle Calculator</a></div>
          <div></div>
          <div><a href="/purpose">Purpose</a></div>
      </div>
      
      <BrowserRouter>
        <Switch>
          <Route path="/dash">
            <Dashboard />
          </Route>
          <Route path="/purpose">
            <Purpose />
          </Route>
          <Route path="/">
            <App />
          </Route>
        </Switch>
      </BrowserRouter>

      <div className={"main-title"}>
          <div>Art Assets: <a href="https://www.youtube.com/user/CarbotAnimations">Carbots</a> | <a href="https://starcraft2.com/en-us/">StarCraft 2</a></div>
      </div>
    </div>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
