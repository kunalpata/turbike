// BikeTable.js

import React, { Component, useState, useEffect } from 'react';
import '../App.css';
import Table from '../components/Table.js';


function BikeTable(){
	useEffect(() => {
		fetchBikes();
	}, []);

	const [bikes, setBikes] = useState({});

	const fetchBikes = async () => {
		const data = await fetch(
			'/api/getBikes'
		);

		const bikes = await data.json();

		setBikes(bikes);
		console.log(bikes);
	};

	

	return (
		<div className="App">
			<h1>Bike Table</h1>
			{(bikes.hasOwnProperty("hasError") && !bikes.hasError) ? (
				<div>
					<Table data={bikes.data}/>
				</div>
			) : (
				<div>
					<h2>Error: no bikes were found</h2>
					<p>{JSON.stringify(bikes.err)}</p>
				</div>
			)}
		</div>
	);
}

export default BikeTable;