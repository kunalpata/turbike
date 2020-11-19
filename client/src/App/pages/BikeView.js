import React, { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import MyCarousel from '../components/MyCarousel';
import './BikeView.css';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Figure from 'react-bootstrap/Figure';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';


const BikeView = (props) => {
	useEffect(() => {
		getFeaturesForBike();
	}, []);

	// bike info
	const bike = props.location.state.bike;
	const [features, setFeatures] = useState({});
	const encodedID = encodeURIComponent(bike.id);

	// form info
	let today = formatDate(new Date()); // used to prevent date selection before today
	const { push } = useHistory();  // used to route to reservation upon form submit
	const [total, setTotal] = useState("Enter start and end dates for an estimate");
	const [numDays, setNumDays] = useState(0);
	const [startDate, setStartDate] = useState(today);
	const [startTime, setStartTime] = useState("10:00");
	const [endDate, setEndDate] = useState("");
	const [endTime, setEndTime] = useState("10:00");
	const [location, setLocation] = useState(bike.city+', '+bike.state);


	// on page load, queries for bike-features
	const getFeaturesForBike = async () => {
		const url = '/api/search/features?id=' + encodedID;

		const data = await fetch(url)
		.catch((err) => { console.log(err) });

		const features = await data.json()
		.then((features) => {
			setFeatureIcons(features.data);
			setFeatures(features);
		})
		.catch((err) => {console.log(err) });
	};

	// on form submit, gets the form values to pass to reservation
	const handleSubmit = (event) => {
		event.preventDefault();
		push({
			pathname: './reservation',
			state: {
				startDate: startDate,
				startTime: startTime,
				endDate: endDate,
				endTime: endTime,
				location: location,
				total: total,
				numDays: numDays,
				bike: bike
			}
		})
	}

	// calls calcPrice after a date state has changed
	useEffect(() => {
		calcPriceTotal();
	}, [startDate, endDate])
	
	// gets the total days from form date range, then calcs and sets total price
	const calcPriceTotal = () => {
		// source: https://stackoverflow.com/questions/2627473
		const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
		const firstDate = new Date(startDate.replace('-', ','));
		const secondDate = new Date(endDate.replace('-', ','));
	
		const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay)); 
		setNumDays(diffDays);
		setTotal(diffDays*bike.price);
	}

    return(
    	<Container className="bike-view-body">
    		<Row>
    	{/* Bike carousel section */}
    			<Col md={{span: 6, offset: 0}}>
    				<div>
						<span id="bike-name" className="bike-header">{bike.bikeName}</span>
						<span className={"bike-header", "sub-title"}>{bike.brand} - {bike.name} Bike</span>
						<div className="float-right">
							<img alt="clear heart" src={require("../images/clear_heart_200.png")} height="20vh" width="20vh"/>
						</div>
					</div>
					<div>{bike.city}, {bike.state}</div>
					<div className="bike-header">
						<td>
						<img id="star-img" alt="star" src={require("../images/star_200.png")} height="15vh" width="15vh"/>
						</td>
						<span className="bike-header">{bike.rating ? bike.rating : " -"}</span>   
						<span className={"bike-header", "sub-title"}>{bike.ratingLabel}</span>
					</div>
    				
    				{!bike.images ?
    				// no imgs = no image available image
    					<Figure>
							<Figure.Image alt="no images available" width="100%" src={require("../images/cancel_bike_200.png")} />
							<Figure.Caption className="text-center">no images available</Figure.Caption>
						</Figure>
    				: bike.images.length === 1 ?
    				// 1 img gets single image
    					<Figure className="carousel">
							<Figure.Image height="200px" width="200px" src={bike.images[0].url} />
						</Figure>
    					:
    				// 2+ imgs goes to carousel
    					<MyCarousel images={bike.images}/>
    				}
    			</Col>

		{/* Reservation form section */}
    			<Col md={{span: 6, offset: 0}}>
					<Card>
					  <Card.Body>
					    <Card.Title>${bike.price}/Day</Card.Title>
					    <Card.Subtitle className="mb-2 text-muted">Est. Total: {total ? '$'+total : 'enter start and end date for an estimate'}</Card.Subtitle>
					    <Form onSubmit={handleSubmit}>
					    	<Form.Row>
								<Form.Group as={Col} controlId="sDate">
								    <Form.Label>Start of Trip</Form.Label>
								    <Form.Control required type="date" min={today} name="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
								</Form.Group>
								<Form.Group as={Col} controlId="sTime">
									<Form.Label>Start Time</Form.Label>
								    <Form.Control disabled="disabeled" type="time" value={startTime} name="startTime" />
								</Form.Group>
							</Form.Row>

							<Form.Row>
								<Form.Group as={Col} controlId="eDate">
								    <Form.Label>End of Trip</Form.Label>
								    <Form.Control required type="date" min={startDate} name="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
								</Form.Group>
								<Form.Group as={Col} controlId="eTime">
									<Form.Label>End Time</Form.Label>
								    <Form.Control disabled="disabeled" type="time" value="10:00" name="endTime" />
								</Form.Group>
							</Form.Row>

							<Form.Row>
								<Form.Group as={Col} controlId="sLoc">
								    <Form.Label>Pick Up & Return Location</Form.Label>
								    <Form.Control disabled="disabeled" type="text" value={location} name="location" />
								</Form.Group>
							</Form.Row>
							  
							<Button type="submit" className="reservation-button" block>
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
	                		<div className="feature" key={i}>
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

 /* -------  Helpers  -------- */
	/* Takes in the list of features for this bike and adds the image to represent
	** its icon. */
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

	/* Takes in a Date object and converts it to format yyyy-mm-dd*/
    function formatDate(date){
    	let month = '' + (date.getMonth() + 1),
        	day = '' + date.getDate(),
        	year = date.getFullYear();

    	if (month.length < 2) 
        	month = '0' + month;
    	if (day.length < 2) 
        	day = '0' + day;

    	return [year, month, day].join('-');
    }
};

export default BikeView;

