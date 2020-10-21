// BikeTable.js

import React, { Component, useState, useEffect } from 'react';
import '../App.css';
import Table from '../components/Table.js';


function BikeTable(){
	useEffect(() => {
		fetchBikes();
	}, []);

	const [bikes, setBikes] = useState([]);

	const fetchBikes = async () => {
		const data = await fetch(
			'/api/getBikes'
		);

		const bikes = await data.json();
		setBikes(bikes.data);
	};

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

export default BikeTable;