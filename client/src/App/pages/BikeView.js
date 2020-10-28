import React from "react";
import { Link } from 'react-router-dom';


const BikeView = (props) => {

	const bike = props.location.state.bike;

    return(
    	<div>
    		<h1>Bike View</h1>
    		<div>{bike.price}</div>
    	</div>
    );
};

export default BikeView;

