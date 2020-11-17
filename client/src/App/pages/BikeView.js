import React, { useState, useEffect } from "react";
import './BikeView.css';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Carousel from 'react-bootstrap/Carousel';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';


const BikeView = (props) => {
	useEffect(() => {
		getFeaturesForBike();
	}, []);

	const bike = props.location.state.bike;
	const [features, setFeatures] = useState({});
	const encodedID = encodeURIComponent(bike.id);

	const getFeaturesForBike = async () => {
		const url = '/api/search/features?id=' + encodedID;

		const data = await fetch(url)
		.catch((err) => { console.log(err) });

		const features = await data.json()
		.then((features) => {
			setFeatureIcons(features.data);
			console.log(features.data);
			setFeatures(features);
		})
		.catch((err) => {console.log(err) });
	};

	/*
	** Takes in the list of features for this bike and adds the image to represent
	** its icon.
	*/
	function setFeatureIcons(features) {
		features.map((feature) => {
			switch(feature.name){
				case "Kick Stand":
					feature.icon =  require("../images/kick_stand_200.png");
					break;
				case "Water Bottle Holder":
					feature.icon =  require("../images/water_bottle_200.png");
					break;
				case "Disk Brakes":
					feature.icon =  require("../images/disk_brakes_200.png");
					break;
				case "Pouch Included":
					feature.icon =  require("../images/pouch_200.png");
					break;
				default:
					feature.icon = require("../images/chevron_200.png");
			}
		});
	}

    return(
    	<Container className="bike-view-body">
    		<Row>
    	{/* Bike carousel section */}
    			<Col md={{span: 6, offset: 0}}>
    				<div>
						<span id="bike-name" className="bike-header">{bike.brand}</span>
						<div className="float-right">
							<img alt="clear heart" src={require("../images/clear_heart_200.png")} height="20vh" width="20vh"/>
						</div>
					</div>
					<div className="bike-header">
						<td>
						<img id="star-img" alt="star" src={require("../images/star_200.png")} height="15vh" width="15vh"/>
						</td>
						<span className="bike-header">{bike.rating ? bike.rating : " -"}</span>   
						<span id="category" className="bike-header">{bike.name} Bike</span>
					</div>
					<div>{bike.city}, {bike.state}</div>
    				
    				{/* TODO: get bike images and add them here with map */}
					<Carousel className="carousel">
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
    			</Col>

		{/* Reservation form section */}
    			<Col md={{span: 6, offset: 0}}>
					<Card>
					  <Card.Body>
					    <Card.Title>${bike.price}/hour</Card.Title>
					    <Card.Subtitle className="mb-2 text-muted">Est. Total: $</Card.Subtitle>
					    <Form>
					    	<Form.Row>
								<Form.Group as={Col} controlId="sDate">
								    <Form.Label>Start Date</Form.Label>
								    <Form.Control type="text" />
								</Form.Group>
								<Form.Group as={Col} controlId="sTime">
									<Form.Label>Start Time</Form.Label>
								    <Form.Control type="text" />
								</Form.Group>
							</Form.Row>

							<Form.Row>
								<Form.Group as={Col} controlId="eDate">
								    <Form.Label>End Date</Form.Label>
								    <Form.Control type="text" />
								</Form.Group>
								<Form.Group as={Col} controlId="eTime">
									<Form.Label>End Time</Form.Label>
								    <Form.Control type="text" />
								</Form.Group>
							</Form.Row>

							<Form.Row>
								<Form.Group as={Col} controlId="sLoc">
								    <Form.Label>Pick Up Location</Form.Label>
								    <Form.Control type="text" />
								</Form.Group>
								<Form.Group as={Col} controlId="eLoc">
									<Form.Label>Return Location</Form.Label>
								    <Form.Control type="text" />
								</Form.Group>
							</Form.Row>
							  
							<Button className="reservation-button" block>
							    Continue
							</Button>
					    </Form>
					  </Card.Body>
					</Card>
    			</Col>
    		</Row>

    	{/* Bike details section */}
    		<Row>
    			<Col md={{span: 2, offset: 0}}>
    				<p className="label">Hosted By</p>
    				<h3>{bike.user_name}</h3>
    				<p>{bike.email}</p>
    			</Col>
    			<Col md={{span: 4, offset: 0}}>
    				<p className="label">Description</p>
    				<p>{bike.bike_details}</p>
    			</Col>

    			<Col md={{span: 6, offset: 0}}>
    				<p className="label">Features</p>
    				{(features.data && features.data[0]) ? (
	                <div>
	                	{features.data.map( (feature, i) => (
	                		<div className="feature">
								<img alt={feature.name} src={feature.icon} height="15vh" width="15vh"/>
								<p className="feature-name">{feature.name}</p>
	                		</div>
	                	))}
	                </div>
	              ) : (
	                <div>
	                  <p>There are no features for this bike</p>
	                </div>
	              )}
    			</Col>
    		</Row>
    	</Container>
    );
};

export default BikeView;

