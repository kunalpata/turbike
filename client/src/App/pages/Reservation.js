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

	const test = props.location.state.test;

    return (
    	<div>
    	<h1>resesrvation</h1>
    	<h2>{test}</h2>
    	</div>
    );
};

export default Reservation;