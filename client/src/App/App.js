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
import UserBikeList from "./pages/UserBikeList";
import Listings from './pages/Listings';
import BikeView from './pages/BikeView';
import Reservation from './pages/Reservation';
import BikeAdd from './pages/BikeAdd';
import EditBike from "./pages/EditBike";
import MyNavbar from './components/MyNavbar';
import AdvancedSearch from './pages/AdvancedSearch';
import UserContract from './pages/UserContract';



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
              <Route exact path='/bikeView' render={(props) => <BikeView {...props} userInfo={this.state.user} />} />
              <Route exact path='/reservation' render={(props) => <Reservation {...props} userInfo={this.state.user} />} />
              <Route exact path='/bikeAdd' render={(props) => <BikeAdd {...props} passUser={this.authenticateInfo}/>} />
              <Route exact path='/editBike' render={(props) => <EditBike {...props} passUser={this.authenticateInfo}/>}  />
              <Route exact path='/advancedSearch' component={AdvancedSearch}/>

              <Route exact path='/dashboard' render={(props) => <UserDashboard {...props} userInfo={this.state.user} passUser={this.authenticateInfo}/>}/>
              <Route exact path='/userInfo' render={(props) => <UserAccountInfo {...props} userInfo={this.state.user} passUser={this.authenticateInfo}/>}/>
              <Route exact path='/userContracts' render={(props) => <UserContract {...props} userInfo={this.state.user} passUser={this.authenticateInfo}/>}/>
              <Route exact path='/userBikes' render={(props) => <UserBikeList {...props} userInfo={this.state.user} passUser={this.authenticateInfo} authUser={this.state.isAuthenticated} />} />

              
              {/*{console.log(this.state.user)}*/}
          </Switch>
      </Router>
      
    );
  }
}

export default App;