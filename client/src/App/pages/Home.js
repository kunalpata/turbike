// Home.js

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

//import Table from "../components/Table.js";

class Home extends Component {
  // Initialize the default state
  constructor(props) {
    super(props);
  }

  render() {
      return (
        <div className="App">
          <header className="App-header">
            <h1 className="App-title">Turbike</h1>
          </header>
          <Link to={'./bikeTable'}>
          	<button variant='raised'>Bike Table</button>
          </Link>
          <Link to={'./signUp'}>
            <button variant='raised'>SignUp</button>
          </Link>
          <Link to={'./login'}>
            <button variant='raised'>Login</button>
          </Link>
        </div>
      );
    //}
  }
}

export default Home;