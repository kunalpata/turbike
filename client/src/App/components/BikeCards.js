// BikeList.js

import React from "react";
import { Link } from 'react-router-dom';
import Card from "react-bootstrap/Card";
import "../pages/Listings.css";


const BikeList = ({bikes}) => {
    return(
    	<div>
    	{bikes.map( (bike) => (
    		<Link to={{
            	pathname: "./bikeView",
            	state: {bike: bike}
        	}} style={{ textDecoration: 'none' }}>
				<Card className="card">

					{/* TODO: Get images from bike-image table */}
					<Card.Img variant="top" src={require("../images/road_bike.jpg")} />
					<Card.Body>

						{/* TODO: Add brand/name attribute to bike table */}
						<Card.Title id="card-title" className="card-info">Bike Name</Card.Title>
						<div className="float-right">

							{/* TODO: Make heart clickable - saves to favorites - must be logged in */}
							<img alt="clear heart" src={require("../images/clear_heart_200.png")} height="20vh" width="20vh"/>
						</div>
						<Card.Text>

							{/* TODO: Add rating and category attributes to bike table */}
							<div className="card-info">
								<img id="star-img" alt="star" src={require("../images/star_200.png")} height="15vh" width="15vh"/>
								4.5   
							</div>
							<div id="category" className="card-info">Road Bike</div>
							<div className="float-right">${bike.price}/hour</div>
						</Card.Text>
					</Card.Body>
				</Card> 
			</Link>  		
    	))}
    	</div>


    );
};

export default BikeList;
