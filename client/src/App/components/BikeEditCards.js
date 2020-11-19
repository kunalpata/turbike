// BikeList.js

import React from "react";
import { Link } from 'react-router-dom';
import Card from "react-bootstrap/Card";
import "../pages/Listings.css";


const BikeEditCards = ({bikes}) => {
    return(
        <div>
            {bikes.map( (bike, i) => (
                <Link key={i} to={{
                    pathname: "./editBike",
                    state: {bike: bike}
                }} style={{ textDecoration: 'none' }}>
                    <Card className="card">

                        {/* TODO: Get images from bike-image table */}
                        <Card.Img variant="top" src={require("../images/road_bike.jpg")} />
                        <Card.Body>

                            <Card.Title id="card-title" className="card-info">{bike.brand}</Card.Title>
                            <span className="float-right">

						</span>
                            <Card.Text>
							<span className="card-info">
								<td>
									<img id="star-img" alt="star" src={require("../images/star_200.png")} height="15vh" width="15vh"/>
								</td>
                                {/* TODO: Add rating as bike.rating_score - need bikes to start with default rating */}
                                <span>4.5</span>
								<span id="category" className="card-info">{bike.bikeName}</span>
								<span className="float-right">${bike.price}/hour</span>
                                <br/>
                                <span className="float-right">Edit</span>
							</span>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Link>
            ))}
        </div>


    );
};

export default BikeEditCards;
