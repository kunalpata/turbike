// Reservation.js

import React, { useState, useEffect } from "react";
import './Reservation.css';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Figure from 'react-bootstrap/Figure';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';


const Reservation = (props) => {

	const formInfo = props.location.state;
	const bike = props.location.state.bike;
	const subTotal = bike.price * formInfo.numDays;
	const tax = subTotal * .06;
	const startDate = formatDate(formInfo.startDate);
	const endDate = formatDate(formInfo.endDate);

    return (
    	<Container className="reservation-body-area">
    		<Row>
    			<Col md={{span: 8, offset: 0}}>
    				<div>Book your ride with {bike.bikeName}</div>
    			</Col>
    			<Col md={{span: 4, offset: 0}}>
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
    			</Col>
    		</Row>
    	</Container>
    );
};


function formatDate(date) {
	const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	date = new Date(date.replace('-', ','));

	let dateObj = {};
	dateObj.month = months[date.getMonth()];
	dateObj.day = date.getDate();

	return dateObj;
}

const LineItem = (props) => {
	return (
		<div>
			<span className={props.class}>{props.label}</span>
			<div className="float-right">{props.amount}</div>
		</div>
	);
};

export default Reservation;