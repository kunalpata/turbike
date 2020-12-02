// BikeList.js

import React from "react";
import { Link } from 'react-router-dom';
import Card from "react-bootstrap/Card";
import Figure from "react-bootstrap/Figure";
import "../pages/Listings.css";


const BikeEditCards = ({bikes}) => {
    return(
        <div>
            {bikes.map( (bike, i) => (
                <div key={i} style={{ textDecoration: 'none' }}>
                    <Card className="card">

                        {/*<Card.Img variant="top" src={require("../images/road_bike.jpg")} />*/}
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

						</span>
                            <Card.Text>
							<span className="card-info">
								{/*<td>*/}
                                {/*	<img id="star-img" alt="star" src={require("../images/star_200.png")} height="15vh" width="15vh"/>*/}
                                {/*</td>*/}
                                {/*/!* TODO: Add rating as bike.rating_score - need bikes to start with default rating *!/*/}
                                {/*<span>4.5</span>*/}
                                <span id="category" className="card-info">{bike.bikeName}</span>
								<span className="float-right">${bike.price}/day</span>
                                <br/>
                                <Link to={{
                                    pathname: "./editBike",
                                    state: {bike: bike}
                                }} className="float-right">Edit</Link>
							</span>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </div>
            ))}
        </div>


    );
};

export default BikeEditCards;
