// BikeTable.js

import React, { Component } from 'react';
import '../App.css';
import Table from '../components/Table.js';

class BikeTable extends Component {
	// Init state to hold bikes array
	constructor(props){
		super(props);
		this.state = {
			bikes: [],
			error: null,
			isLoaded: false
		}
	}

	// Fetch bikes on first mount
	componentDidMount() {
		this.getBikes();
	}

	// Get the bikes from backend
	getBikes = () => {
		fetch('http://localhost:9000/api/getBikes')
		.then(res => res.json())
		.then((res) => {
			this.setState({ 
				bikes: res.data,
				error: null,
				isLoaded: true
			});
		},
		(error) => {
			this.setState({
				bikes: [],
				error
			});
		})
	}

	render() {
		const { bikes, error, isLoaded } = this.state;

		return (
			<div className="App">
				<h1>Bike Table</h1>
				{bikes.length ? (
					<div>
						<Table data={bikes}/>
					</div>
				) : (
					<div>
						<h2>Error: no bikes were found</h2>
					</div>
				)}
			</div>
		);
	}
}

export default BikeTable;