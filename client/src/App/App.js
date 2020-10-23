// App.js

import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import './App.css';

import Home from './pages/Home';
import BikeTable from './pages/BikeTable';
import Register from './pages/Register';
import Login from './pages/Login';
import Listings from './pages/Listings';


class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      isAuthenticated: false,
      user:{}
    }
    this.authenticateInfo = this.authenticateInfo.bind(this);
  }

  //fetch user
  componentDidMount(){
    this.getUser();
  }

  //get user from backend
  getUser = async() => {
    await fetch('/api/user')
    .then(res => res.json())
    .then((res) => {
      //console.log(res)
      this.authenticateInfo(res);
    })
  }

  authenticateInfo(userInfo){
    this.setState({isAuthenticated: userInfo.isAuthenticated,
                   user: {...userInfo}
                  });
  }

  render() {

    return (
      <Switch>
          <Route exact path='/' render={(props) => <Home {...props} userInfo={this.state.user}/>} />
          <Route path='/bikeTable' component={BikeTable} />
          <Route 
            path='/register' 
            render={(props) => !this.state.isAuthenticated?<Register {...props} passUser={this.authenticateInfo}/> : <Redirect to='/' />}
          />
          <Route 
            path='/login' 
            render={(props) => !this.state.isAuthenticated?<Login {...props} passUser={this.authenticateInfo}/> : <Redirect to='/' />}
          />

          <Route exact path='/listings' component={Listings} />
      </Switch>
    );
  }
}

export default App;

{/*<Switch>
          <Route exact path='/' component={Home} />
          <Route path='/bikeTable' component={BikeTable} />
          <Route path='/register' component={Register} />
          <Route path='/login' component={Login} />
          <Route exact path='/listings' component={Listings} />
</Switch>*/}