import React from "react";
import './BikeView.css';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Carousel from 'react-bootstrap/Carousel';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';


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
    	</Container>
    );
};

export default BikeView;

