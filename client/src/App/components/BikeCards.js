// BikeList.js

import React from "react";
import { Link } from 'react-router-dom';
import Card from "react-bootstrap/Card";
import Figure from "react-bootstrap/Figure";
import "../pages/Listings.css";


const BikeCards = ({bikes}) => {
    return(
    	<div>
    	{bikes.map( (bike, i) => (
    		<Link key={i} to={{
            	pathname: "./bikeView",
            	state: {bike: bike}
        	}} style={{ textDecoration: 'none' }}>
				<Card className="card">
					{bike.images ?
						<Card.Img variant="top" src={bike.images[0].url} />
					:
						<Figure>
							<Figure.Image alt="no image available" width="100%" src={require("../images/cancel_bike_200.png")} />
							<Figure.Caption className="text-center">no image available</Figure.Caption>
						</Figure>
					}
					<Card.Body>
						<Card.Title id="card-title" className="card-info">{bike.brand}</Card.Title>
						<span className="float-right">

							{/* TODO: Make heart clickable - saves to favorites - must be logged in */}
							<img alt="clear heart" src={require("../images/clear_heart_200.png")} height="20vh" width="20vh"/>
						</span>
						<Card.Text>
							<span className="card-info">
								<td>
									<img id="star-img" alt="star" src={require("../images/star_200.png")} height="15vh" width="15vh"/>   
								</td>

							{/* TODO: Add rating as bike.rating_score - need bikes to start with default rating */}
								
								<span>{bike.rating ? bike.rating : " -"}</span>
                <span id="category" className="card-info">{bike.bikeName} Bike</span>
								<span className="float-right">${bike.price}/hour</span>
							</span>
						</Card.Text>
					</Card.Body>
				</Card> 
			</Link>
    	))}
    	</div>


    );
};

export default BikeCards;
