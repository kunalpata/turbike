import React from "react";
import './BikeView.css';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Carousel from 'react-bootstrap/Carousel';


const BikeView = (props) => {

	const bike = props.location.state.bike;

    return(
    	<Container className="bike-view-body">
    		<Row>
    			<Col md={{span: 6, offset: 0}}>
					<div id="bike-name" className="bike-header">Bike Name</div>
					<div className="bike-header">
						<img id="star-img" alt="star" src={require("../images/star_200.png")} height="15vh" width="15vh"/>
						4.5   
					</div>
					<div id="category" className="bike-header">Road Bike</div>
					<div className="float-right">
						<img alt="clear heart" src={require("../images/clear_heart_200.png")} height="20vh" width="20vh"/>
					</div>

					<div>{bike.city}, {bike.state}</div>
    				
    				{/* TODO: get bike images and add them here with map */}
					<Carousel>
					  <Carousel.Item>
					    <img
					      className="d-block w-100"
					      src={require("../images/road_bike.jpg")}
					      alt="First slide"
					    />
					  </Carousel.Item>
					  <Carousel.Item>
					    <img
					      className="d-block w-100"
					      src={require("../images/road_bike.jpg")}
					      alt="Second slide"
					    />
					  </Carousel.Item>
					</Carousel>

					<p>{bike.bike_details}</p>
    			</Col>

    			<Col md={{span: 6, offset: 0}}>
    				
    			</Col>
    		</Row>
    	</Container>
    );
};

export default BikeView;

