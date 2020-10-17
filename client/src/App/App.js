// App.js

import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';

import Home from './pages/Home';
import BikeTable from './pages/BikeTable';
import SignUp from './pages/SignUp';
import Login from './pages/Login';

class App extends Component {
  render() {
    const App = () => (
      <div>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route path='/bikeTable' component={BikeTable} />
          <Route path='/signUp' component={SignUp} />
          <Route path='/login' component={Login} />
        </Switch>
      </div>
    )
    return (
      <Switch>
        <App />
      </Switch>
    );
  }
}

export default App;