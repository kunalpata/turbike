// Reservation.js

import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import './Reservation.css';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBicycle } from '@fortawesome/free-solid-svg-icons';


const Reservation = (props) => {

	// For rendering differnet steps of the contract
	const [stepOne, setStepOne] = useState(true);
	const [stepTwo, setStepTwo] = useState(false);
	const [stepThree, setStepThree] = useState(false);
	const [stepNum, setStepNum] = useState(1);
	const [confirm, setConfirm] = useState(false);
	const [notice, setNotice] = useState("");

	const bike = props.location.state.bike;

	// For billing 
	const formInfo = props.location.state;
	const subTotal = bike.price * formInfo.numDays;
	const tax = subTotal * .06;
	const startDate = formatDate(formInfo.startDate);
	const endDate = formatDate(formInfo.endDate);


	// Button handlers
	const handleGoToTwo = () => {
		setStepOne(false);
		setStepTwo(true);
		setStepNum(2);
	}

	const handleGoToThree = () => {
		setStepTwo(false);
		setStepThree(true);
		setStepNum(3);
	}

	const handleBookIt = () => {
		setStepThree(false);
		setConfirm(true);
		postContract();
	}

	const handleGoBackToOne = () => {
		setStepTwo(false);
		setStepOne(true);
		setStepNum(1);
	}

	const handleGoBackToTwo = () => {
		setStepTwo(true);
		setStepThree(false);
		setStepNum(2);
	}


	// Post contract
	const postContract = async () => {
		// Build post body with contract info
		let contractInfo = {
			host_id: bike.user_id,
			customer_id: props.userInfo.user.id,
			bike_id: bike.id,
			start_datetime: formInfo.startDate + ' ' + formInfo.startTime,
			expiration_datetime: formInfo.endDate + ' ' + formInfo.endTime
		}

		// Post to db
		await fetch('/api/add/contract', {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({contractInfo})
		})
		.then( (res) => { 
			return res.json 
		})
		.then( (res) => {
			console.log(res);
			if(res.isAuthenticated == false) {
				props.passUser({...res});
			} else if (res.err === undefined) {
				setNotice("Contract Created");
			} else {
				setNotice("Server Error! Please Try Again.");
			}
		})
		.catch( (err) => { console.log(err) });
	}


    return (
    	<Container className="reservation-body-area">
    		{confirm ? 
    			<Confirmation />
    		:
    		<Row>
    		{/* Contract area */}
    			<Col md={{span: 7, offset: 0}}>
    				<Container>
    					<div className="float-right">Step {stepNum} of 3</div>
	    				<div className="main-title">Book your ride with {bike.bikeName}</div>
	    				<div>	
	    					<FontAwesomeIcon icon={faBicycle} color="gray"/>
	    					<span><span className="font-weight-bold">  Act fast!</span> Prices and availability may change.</span>
	    				</div>
	    				<div>	
	    					<img alt="cancel bike" src={require("../images/cancel_bike_200.png")} height="20vh" width="20vh" />
	    					<span><span className="font-weight-bold">  Free cancelation</span> until {startDate.month +' '+ startDate.day +' at 7:00am'}</span>
	    				</div>
	    				<hr></hr>

	    				{ !props.userInfo.isAuthenticated ?
		    					<div>
		    						<div>You must log in to continue</div>
		    						<Link to={{
                                                pathname: '/login',
                                                state: {
															from: props.location.pathname,
															...props.location.state
                                                        }
                                              }}><Button>Log In</Button></Link>
		    					</div>
		    				: stepOne ? 
		    					<ContractStepOne handleGoToTwo={handleGoToTwo} user={props.userInfo.user}/>
		    				: stepTwo ?
		    					<ContractStepTwo handleGoToThree={handleGoToThree} handleGoBackToOne={handleGoBackToOne} />
		    				: stepThree ?
		    					<ContractStepThree 
		    						handleBookIt={handleBookIt} 
		    						handleGoBackToTwo={handleGoBackToTwo} 
		    						bike={bike} 
		    						startDate={startDate} 
		    						endDate={endDate} 
		    						formInfo={formInfo} 
		    						amount={(subTotal + 2.0 + tax + bike.penalty).toFixed(2)}
		    					/>
	    				: 	<Confirmation />
	    				}
	    			</Container>
    			</Col>

    		{/* Billing area */}
    			<Col md={{span: 5, offset: 0}}>
    				<Container>
    				<div className="billing-area">
						<div className="billing-heading">{bike.brand} - {bike.name} Bike</div>
						<div>{formInfo.location}</div>
						<div className="inline">
							<td>
								<img id="star-img" alt="star" src={require("../images/star_200.png")} height="15vh" width="15vh"/>
							</td>
							<span>{bike.rating ? bike.rating : " -"}</span>   
							<span className="sub-title">{bike.ratingLabel}</span>
						</div>	
						<div className="billing-dates">
							<LineItem label="Start Trip" amount={startDate.month +' '+ startDate.day} />
							<LineItem label="End Trip" amount={endDate.month +' '+ endDate.day} />
						</div>
						<LineItem label={'$'+bike.price+' x '+formInfo.numDays+' days'} amount={'$'+subTotal.toFixed(2)} />
						<LineItem label="Service Fee" amount="$2.00" />
						<LineItem label="Tax" amount={'$'+tax.toFixed(2)} />
						<hr></hr>
						<LineItem label="Total" amount={'$'+(subTotal + 2.0 + tax).toFixed(2)} class="font-weight-bold"/>
						<LineItem label="Refundable Late Deposite" amount={'$'+bike.penalty} />
						<LineItem label="Total + deposit" amount={'$'+(subTotal + 2.0 + tax + bike.penalty).toFixed(2)} />
						<hr></hr>
						<LineItem label="Due today" amount={'$'+(subTotal + 2.0 + tax + bike.penalty).toFixed(2)} class="font-weight-bold" />
    				</div>
    				</Container>
    			</Col>
    		</Row>
    		}
    	</Container>
    );
};

/* ----------  Helpers  ----------- */

/* Takes in the date in the form submit format, gets the month and day in a readable format and returns them
** as an object with month and day attributes. */
function formatDate(date) {
	const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	date = new Date(date.replace('-', ','));

	let dateObj = {};
	dateObj.month = months[date.getMonth()];
	dateObj.day = date.getDate();

	return dateObj;
}

/* Used for items in the billing section. Have a label and price */
const LineItem = (props) => {
	return (
		<div>
			<span className={props.class}>{props.label}</span>
			<div className="float-right">{props.amount}</div>
		</div>
	);
};

/* Step 1: confirm user info */
const ContractStepOne = (props) => {
	return(
		<div>
			<div className="float-right">Step 1</div>
    		<div className="section-title">Review Contact Information</div>

    		<div className="sub-title">First Name</div>
    		<div className="user-info">{props.user.first_name}</div>

    		<div className="sub-title">Last Name</div>
    		<div className="user-info">{props.user.last_name}</div>

    		<div className="sub-title">Email</div>
    		<div className="user-info">{props.user.email}</div>

    		<div className="continue-note">By clicking 'Confirm & Continue' you are agreeing to our Terms and Conditions, and to receive booking-related emails.</div>
    		<Button className="continue-button" onClick={props.handleGoToTwo}>Confirm & Continue</Button>
		</div>
	);
};

/* Step 2: enter fake payement info */
const ContractStepTwo = (props) => {
	return(
		<div>
			<div className="float-right">Step 2</div>
    		<div className="section-title">Enter Payment Information</div>

			<Form className="card-form">
		    	<Form.Row>
					<Form.Group as={Col}>
					    <Form.Label>*Card Number</Form.Label>
					    <Form.Control disabled="disabled" type="text"  value="1234 5678 9101 1121" />
					</Form.Group>
				</Form.Row>

				<Form.Row>
					<Form.Group as={Col}>
					    <Form.Label>*Expiration Date</Form.Label>
					    <Form.Control disabled="disabled" type="date" value="2025-10-10" />
					</Form.Group>
					<Form.Group as={Col}>
						<Form.Label>*Security Code (CVV)</Form.Label>
					    <Form.Control disabled="disabeled" type="txt" value="123" />
					</Form.Group>
				</Form.Row>

				<Form.Row>
					<Form.Group as={Col}>
					    <Form.Label>*Card Holder Name</Form.Label>
					    <Form.Control disabled="disabled" type="text" value="Jane Doe" />
					</Form.Group>
				</Form.Row>
		    </Form>    		

		    <div>* Required</div>
    		<Button className="continue-button" onClick={props.handleGoToThree}>Continue</Button>
    		<Button className="go-back-button" onClick={props.handleGoBackToOne}>Go Back</Button>
		</div>
	);
};

/* Step 3: review and confirm */
const ContractStepThree = (props) => {
	return(
		<div>
			<div className="float-right">Step 3</div>
    		<div className="section-title">Review and Confirm Booking</div>

    		<div className="info-block">
	    		<div className="font-weight-bold">Bike Info</div>
	    		<div><span className="sub-title">Name: </span>{props.bike.bikeName}</div>
	    		<div><span className="sub-title">Brand: </span>{props.bike.brand}</div>
	    		<div><span className="sub-title">Host: </span>{props.bike.user_name}</div>
    		</div>

    		<div className="info-block">
    			<div className="font-weight-bold">Reservation Info</div>
    			<div><span className="sub-title">Start Date: </span>{props.startDate.month+' '+props.startDate.day+', at '+props.formInfo.startTime+'am'}</div>
    			<div><span className="sub-title">End Date: </span>{props.endDate.month+' '+props.endDate.day+', at '+props.formInfo.endTime+'am'}</div>
    			<div><span className="sub-title">Location: </span>{props.bike.address+', '+props.bike.city+', '+props.bike.state+', '+props.bike.zip}</div>
    		</div>

    		<div className="info-block">
    			<div className="font-weight-bold">Payment Info</div>
    			<div><span className="sub-title">Card ending in: </span>1121</div>
    			<div><span className="sub-title">Payment amount: </span>${props.amount}</div>
    		</div>

    		<Button className="continue-button" onClick={props.handleBookIt}>Book It!</Button>
    		<Button className="go-back-button" onClick={props.handleGoBackToTwo}>Go Back</Button>
		</div>
	);
};

/* Confirmation page */
const Confirmation = (props) => {
	return(
		<div>
			<h1>Congrats</h1>
		</div>
	);
};


export default Reservation;