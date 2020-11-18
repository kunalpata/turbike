// App.js

import React, { Component } from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import './App.css';

import Home from './pages/Home';
import BikeTable from './pages/BikeTable';
import Register from './pages/Register';
import Login from './pages/Login';
import UserDashboard from './pages/UserDashboard';
import UserAccountInfo from "./pages/UserAccountInfo";
import Listings from './pages/Listings';
import BikeView from './pages/BikeView';
import BikeAdd from './pages/BikeAdd';
import MyNavbar from './components/MyNavbar';
import AdvancedSearch from './pages/AdvancedSearch';



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
    await fetch('/api/auth/user')
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
      <Router>
          <MyNavbar userInfo={this.state.user} passUser={this.authenticateInfo}/>
          <Switch>
              <Route exact path='/' render={(props) => <Home {...props} userInfo={this.state.user}/>} />
              <Route exact path='/bikeAdd' render={(props) => <BikeAdd {...props} passUser={this.authenticateInfo}/>} />
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
              <Route exact path='/bikeView' component={BikeView} />

              <Route exact path='/bikeAdd' component={BikeAdd} />
              <Route exact path='/advancedSearch' component={AdvancedSearch}/>

              <Route exact path='/dashboard' render={(props) => <UserDashboard {...props} userInfo={this.state.user} />}/>
              <Route exact='/userinfo' render={(props) => <UserAccountInfo {...props} userInfo={this.state.user} />}/>


              {/*{console.log(this.state.user)}*/}
          </Switch>
      </Router>
      
    );
  }
}

export default App;