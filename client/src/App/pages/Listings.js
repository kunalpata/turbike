// Listings.js

import React from 'react';
import { Link } from 'react-router-dom';
import MyNavbar from '../components/MyNavbar';
import './Listings.css';

const Listings = (props) => {

	const searchTerm = props.location.state.search;

  	return (
  		<div>
  			<h1>Bike Listings</h1>
  			<p>{searchTerm}</p>
  			<Link to={'./bikeTable'}>
        		<button variant='raised'>Bike Table</button>
      		</Link>
  		</div>
  	)
};

export default Listings;