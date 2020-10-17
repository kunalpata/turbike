// Home.js

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

//import Table from "../components/Table.js";

class Home extends Component {
  // Initialize the default state
  constructor(props) {
    super(props);
    // this.state = { 
    //   apiResponse: [],
    //   error: null,
    //   isLoaded: false
    // };
  }

  // Fetch data from API and store it in the response on this.state.apiResonse
  // callAPI() {
  //   fetch("http://localhost:9000/")
  //     .then(res => res.json())
  //     .then((res) => {
  //       this.setState({ 
  //         apiResponse: res.data,
  //         error: null,  
  //         isLoaded: true
  //       });
  //     },
  //     (error) => {
  //       this.setState({
  //         apiResponse: [],
  //         error
  //       });
  //     }
  //   )
  // }

  // Lifecycle method to execute callAPI() after this component mounts
  // componentDidMount() {
  //   this.callAPI();
  // }

  render() {
    //const {apiResponse, error, isLoaded} = this.state;

    // if(error){
    //   console.log(error.message);
    // }else if (!isLoaded){
    //   return <div>Loading...</div>;
    // }else{
      return (
        <div className="App">
          <header className="App-header">
            <h1 className="App-title">Turbike</h1>
          </header>
          <Link to={'./bikeTable'}>
          	<button variant='raised'>To Bike Table</button>
          </Link>
          {/*<Table data={apiResponse} />*/}
        </div>
      );
    //}
  }
}

export default Home;