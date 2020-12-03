// Reservation.js

import React, { useState, useEffect } from "react";
import { Link, useHistory } from 'react-router-dom';
import DismissibleAlert from '../components/DismissibleAlert';
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";
import setSeconds from "date-fns/setSeconds";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

import './Reservation.css';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Jumbotron from 'react-bootstrap/Jumbotron'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBicycle } from '@fortawesome/free-solid-svg-icons';


const Reservation = (props) => {
	// check form dates for scheduling conflict
	useEffect(() => {
		getContractDates();
	}, []);

	// For rendering differnet steps of the contract
	const [stepOne, setStepOne] = useState(true);
	const [stepTwo, setStepTwo] = useState(false);
	const [stepThree, setStepThree] = useState(false);
	const [stepNum, setStepNum] = useState(1);
	const [confirm, setConfirm] = useState(false);
	
	// For validating contract - dates and users
	const [badDates, setBadDates] = useState(false);
	const [dates, setDates] = useState([]);
	const [contractDates, setContractDates] = useState([]);
	const [invalidBook, setInvalidBook] = useState(true);
	const [notice, setNotice] = useState("");

	const { push } = useHistory();
	const bike = props.location.state.bike;

	// For billing 
	const formInfo = props.location.state;
	const [numDays, setNumDays] = useState(formInfo.numDays);
	const subTotal = bike.price * numDays;
	const tax = subTotal * .06;
	const [startDate, setStartDate] = useState(formatDate(formInfo.startDate));
	const [endDate, setEndDate] = useState(formatDate(formInfo.endDate));
	const [startDT, setStartDT] = useState(formInfo.startDate);
	const [endDT, setEndDT] = useState(formInfo.endDate);


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

	const handleResetDates = (start, end) => {
		start = formatToCalendarDate(start);
		end = formatToCalendarDate(end); 

		// formatted version for display
		setStartDate(formatDate(start));
		setEndDate(formatDate(end));
		
		// date-time version for db
		setStartDT(start);
		setEndDT(end);

		resetNumDays(start, end);
		setBadDates(false);

		//checkForConflicts(dates);
	}

	useEffect(()=>{
		checkForConflicts(contractDates);
	}, [startDT, endDT, badDates]);

	/* Called if user selects new dates. It calcs the number of days in the new range
	and rests numDays */
	const resetNumDays = (startDate, endDate) => {
		const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds

		let firstDate = startDate.split('-');
		let secondDate = endDate.split('-');

		firstDate = new Date(parseInt(firstDate[0]), parseInt(firstDate[1])-1, parseInt(firstDate[2]));
		secondDate = new Date(parseInt(secondDate[0]), parseInt(secondDate[1])-1, parseInt(secondDate[2]));

		const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay)); 
		setNumDays(diffDays + 1);  // +1 for single day bookings
	}

	/* Takes in a date and formats it to get out yyyy-mm-dd */
	const formatToCalendarDate = (date) => {
		let d = new Date(date),
        	month = '' + (d.getMonth() + 1),
        	day = '' + d.getDate(),
        	year = d.getFullYear();

	    if (month.length < 2) 
	        month = '0' + month;
	    if (day.length < 2) 
	        day = '0' + day;

	    return [year, month, day].join('-');
	}


	/* Gets the dates of the constracts this bike is booked in. Stores the dates
	as contractDates, gets the all the dates in the range between start and end
	and stores them dates, and checks for conflicts. */
	const getContractDates = async () => {
		// get contract dates for this bike
		await fetch('/api/get/contracts/dates?bikeId=' + bike.id)
		.then( (res) => { return res.json() })
		.then( (res) => {
			if (res.dates) {
				setContractDates(res.dates);
				setDates(getAllBlockedDates(res.dates));
				checkForConflicts(res.dates);
			}
		})
		.catch( (err) => { console.log(err) });
	}

	/* Takes in a list of contract date ranges, where date ranges have a start date and end date. 
	Loops over the contract dates and if there is a conflict with the selected dates, it
	sets badDates to render the date picker. */
	const checkForConflicts = (dates) => {
		dates.forEach( (dateRange) => {
			if (isDateConflict(dateRange.start_datetime, dateRange.expiration_datetime)) {
				setBadDates(true);
			}
		});	
	}

	/* Takes in the start and end date of a contract and determines if the desired form dates
	overlap with any contract dates. Returns true if there is a conflict, false otherwise. */
	const isDateConflict = (contractStart, contractEnd) => {
		// Convert dates to time stamps for comparison
		contractStart = new Date(contractStart).getTime();
		contractEnd = new Date(contractEnd).getTime();
		let desiredStart = new Date(startDT + 'T' + formInfo.startTime).getTime();
		let desiredEnd = new Date(endDT + 'T' + formInfo.endTime).getTime();

		// See if desired start is within contracted range
		if (desiredStart >= contractStart && desiredStart <= contractEnd) {
			return true;
		}

		// See if desired end is within contracted range
		if (desiredEnd >= contractStart && desiredEnd <= contractEnd) {
			return true;
		}

		// See if contract start is within desired range
		if (contractStart >= desiredStart && contractStart <= desiredEnd) {
			return true;
		}

		// See if contract end is within desired range
		if (contractEnd >= desiredStart && contractEnd <= desiredEnd) {
			return true;
		}

		return false;
	}

	/* Takes in contract date ranges and creates an array of all the dates under
	contract.  */
	const getAllBlockedDates = (cDates) => {
		let dates = new Array();
		cDates.forEach( (dateRange) => {
			let datesToAdd = getDates(dateRange.start_datetime, dateRange.expiration_datetime);
			dates = dates.concat(datesToAdd);
		});
		return dates;
	}

	/* Post contract - builds the contract info needed for the db and posts it to 
	the backend. Has one last safety net to catch a user booking their own bike. */
	const postContract = async () => {
		// Build post body with contract info
		let contractInfo = {
			host_id: bike.user_id,
			customer_id: props.userInfo.user.id,
			bike_id: bike.id,
			start_datetime: startDT + ' ' + formInfo.startTime,
			expiration_datetime: endDT + ' ' + formInfo.endTime
		}

		// Block host from reserving own bike
		if (contractInfo.host_id === contractInfo.customer_id) {
			console.log("here");
			setInvalidBook(true);
		} else {
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
	}


    return (
    	<Container className="reservation-body-area">
    		{badDates ?
    			<Calendar dates={dates} handleResetDates={handleResetDates} />
    		:
    		confirm ? 
    			<Confirmation 
    				bike={bike}
    				startDate={startDate}
    				endDate={endDate}
    				formInfo={formInfo}
    				userInfo={props.userInfo}
    				amount={(subTotal + 2.0 + tax + bike.penalty).toFixed(2)}
    			/>
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
                                              }}><Button className="continue-button">Log In</Button></Link>
		    					</div>
		    				: stepOne ?
		    					<ContractStepOne handleGoToTwo={handleGoToTwo} user={props.userInfo.user} bike={bike} />
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
	    				: 	<h1>Something went wrong</h1>
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
							<span>{bike.rating ? ' ' + bike.rating.toFixed(1) : " -"}</span>   
							<span className="sub-title"><em>{bike.ratingLabel}</em></span>
						</div>	
						<div className="billing-dates">
							<LineItem label="Start Trip" amount={startDate.month +' '+ startDate.day} />
							<LineItem label="End Trip" amount={endDate.month +' '+ endDate.day} />
						</div>
						<LineItem label={'$'+bike.price+' x '+numDays+' days'} amount={'$'+subTotal.toFixed(2)} />
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


/*----------------------- Helper Components --------------------------------*/

/* Renders if bad dates selected. Allows user to select new dates */
const Calendar = (props) => {
	const [startDate, setStartDate] = useState(setHours(setMinutes(setSeconds(new Date(), 0), 0), 10));
  	const [endDate, setEndDate] = useState(setHours(setMinutes(setSeconds(new Date(), 0), 0), 10));
  	const [goodRange, setGoodRange] = useState(true);
  	const [displayStart, setDisplayStart] = useState(null);
  	const [displayEnd, setDisplayEnd] = useState(null);

  	const onChange = dates => {
    	const [start, end] = dates;
    	setStartDate(start);
    	setEndDate(end);
    	setDisplayStart(start);
    	setDisplayEnd(end);
    	let dateRange = getDates(start, end);
    	checkDateRange(dateRange);
  	};

  	const checkDateRange = (dateRange) => {
  		for(let i = 0; i < dateRange.length; i++){
  			for(let j = 0; j < props.dates.length; j ++){
  				if (dateRange[i].toString() === props.dates[j].toString()){
  					setGoodRange(false);
  					return;
  				}
  			}
  		}
  		setGoodRange(true);
  	}

	return(
		<div>
		<Container className="calendar-page">
			<h3>Some or all of the dates you have selected are not available for this bike.</h3>
			<p>Please review the calendar below to select a range without blacked out dates.</p>
			<p><strong>Start:</strong> {displayStart ? displayStart.toDateString() : ""}</p>
			<p><strong>End:</strong> {displayEnd ? displayEnd.toDateString() : ""}</p>
			<DatePicker
				selected={startDate}
				onChange={onChange}
				startDate={startDate}
				endDate={endDate}
				minDate={new Date()}
				selectsRange
				inline
				excludeDates={props.dates}
    		/>
    		{goodRange && startDate && endDate && displayStart && displayEnd ? 
    			<Button className="continue-button" onClick={props.handleResetDates.bind(this, startDate, endDate)}>Submit New Dates</Button>
			: startDate && endDate && displayStart && displayEnd ?
				<div className="sorry-message">Please select range without blacked out dates to continue</div>
			:
				<div className="sorry-message">Please select a start date and end date to continue</div>
			}
		</Container>
		</div>
	);
}

/* Step 1: confirm user info */
const ContractStepOne = (props) => {
	const { push } = useHistory();
	const handleGoBack = (event) => {
		event.preventDefault();
		push({
			pathname: '/bikeView',
			state: {
				bike: props.bike
			}
		})
	}

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

    		{props.user.id === props.bike.user_id ? 
    			<div>
    				<div className="invalid-note">Sorry, a host cannot reserve their own listing.</div>
    				<Button className="go-back-button" onClick={handleGoBack}>Go Back</Button>
    			</div>
    		:
    			<div>
    				<div className="continue-note">By clicking 'Confirm & Continue' you are agreeing to our Terms and Conditions, and to receive booking-related emails.</div>
    				<Button className="continue-button" onClick={props.handleGoToTwo}>Confirm & Continue</Button>
				</div>
			}
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
	const { push } = useHistory();

	const handleViewContracts = (event) => {
		event.preventDefault();
		push({
      		pathname: './userContracts',
      		state: {
      			userId: props.userInfo.user !== undefined ? props.userInfo.user.id : 0
      		}
    	})
	}

	const handleBackToSearch = (event) => {
		event.preventDefault();
		push({
      		pathname: './advancedSearch',
    	})
	}

	const getFullMonth = (abbr) => {
		const months = {
			"Jan": "January",
			"Feb": "February",
			"Mar": "March",
			"Apr": "April",
			"May": "May",
			"Jun": "June",
			"Jul": "July",
			"Aug": "August",
			"Sep": "September",
			"Oct": "October",
			"Nov": "November",
			"Dec": "December"
		}
		return months[abbr];
	}

	return(
		<div>
			<Jumbotron>
			  <h1>That's it, you're booked!</h1>
			  <p>You will be hearing from {props.bike.user_name} soon.</p>
			  <Row className="confirmation-box">
			  	<Col className="verticle-rule" md={{span: 3, offset: 0}}>
			  		<p>Starting</p>
			  		<h3>{props.startDate.day}</h3>
			  		<h5>{getFullMonth(props.startDate.month)}</h5>
			  		<hr></hr>
			  		<p>at 10:00 am</p>
			  	</Col>
			  	<Col md={{span: 8, offset: 0}}>
			  		<h3>{props.bike.bikeName}</h3>
			  		<p>{props.bike.user_name}</p>
			  		<br></br>
			  		<p>{props.formInfo.numDays} {props.formInfo.numDays === 1 ? "day" : "days"} | ${props.amount}</p>
			  		<p>{props.bike.address}, {props.bike.city}, {props.bike.state} {props.bike.zip}</p>
			  	</Col>
			  </Row>
			  <p>
			    <Button className="continue-button" onClick={handleViewContracts}>View Contracts</Button>
			  	<Button className="go-back-button" onClick={handleBackToSearch}>New Search</Button>
			  </p>
			</Jumbotron>
		</div>
	);
};

/* Used for items in the billing section. Have a label and price */
const LineItem = (props) => {
	return (
		<div>
			<span className={props.class}>{props.label}</span>
			<div className="float-right">{props.amount}</div>
		</div>
	);
};


/* ----------  Helpers  ----------- */

/* Takes in the date in the form submit format, gets the month and day in a readable format and returns them
** as an object with month and day attributes. */
function formatDate(date) {
	const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	//date = new Date(date.replace('-', ','));
	date = date.split('-');
	date = new Date(parseInt(date[0]), parseInt(date[1])-1, parseInt(date[2]));

	let dateObj = {};
	dateObj.month = months[date.getMonth()];
	dateObj.day = date.getDate();

	return dateObj;
}

/* Takes in a date and the number of days to increment it, then increments the date. */
// Source: https://stackoverflow.com/questions/4413590
const addDays = function(old_date, days) {
    var date = new Date(old_date);
    date.setDate(date.getDate() + days);
    return date;
}

/* Takes in a start and end date then returns an array of all the dates in the range. */
// Source: https://stackoverflow.com/questions/4413590
function getDates(startDate, stopDate) {
    var dateArray = new Array();
    var currentDate = addDays(startDate, 0);
    var stopDate = addDays(stopDate, 0);
    while (currentDate <= stopDate) {
        dateArray.push(new Date (currentDate));
        currentDate = addDays(currentDate, 1);
    }
    return dateArray;
}


export default Reservation;