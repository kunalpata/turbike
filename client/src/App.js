import React, { Component } from 'react';
import './App.css';


class App extends Component {
  // Initialize the default state
  constructor(props) {
    super(props);
    this.state = { apiResponse: "" };
  }

  // Fetch data from API and store it in the response on this.state.apiResonse
  callAPI() {
    fetch("http://localhost:9000/")
      .then(res => res.text())
      .then(res => this.setState({ apiResponse: res}))
      .catch(err => err);
  }

  // Lifecycle method to execute callAPI() after this component mounts
  componentDidMount() {
    this.callAPI();
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Turbike</h1>
        </header>
        <p className="App-intro">{this.state.apiResponse}</p>
      </div>
    );
  }
}

export default App;
