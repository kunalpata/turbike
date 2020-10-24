// Login.js

import React, { Component , useEffect, useState} from 'react';
import './Login.css';

import MyNavbar from "../components/MyNavbar";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from "react-bootstrap/Card";
import {Link} from "react-router-dom";

function Login (){

	const [loginUsername, setLoginUsername] = useState("");
	const [loginPassword, setLoginPassword] = useState("");

	const login = async () => {
		await fetch('/api/login',{
			method: 'POST',
			headers: { 'Content-Type' : 'application/json' },
			body: JSON.stringify({loginUsername, loginPassword})
			
		})
		.then((res) => { return res.json()})
		.then((res) => { console.log(res)})
		.catch((err) => { console.log(err)})
	};

	const textChangeHandler = (e) => {
		(e.target.name === "username") ? setLoginUsername(e.target.value) :
			setLoginPassword(e.target.value);
	}

	return (
		<div className="Login">
			<Container>
				<Card style={{ width: '30rem', height: '20rem' }}>
					<Row>
						<Col>
							<Card.Img variant="top" src={require("../images/turbike_logo.png")} style={{width: '17vh', height: '17vh'}} />
						</Col>
						<Col>
							<Card.Title style={{ fontSize: '4vh' }}>Login</Card.Title>
						</Col>
					</Row>
					<Card.Body>
						<Card.Text>
							Welcome Back!
						</Card.Text>
						<Form>
							<Form.Control className="col-md" type="text" placeholder="Email" name="email" />
						</Form>
						<Form>
							<Form.Control className="col-md" type="password" placeholder="Password" name="email" />
						</Form>
						<Link to={'./'}>
							<Button variant="danger" >Login</Button>
						</Link>
					</Card.Body>
				</Card>
			</Container>
			{/*<div>*/}
			{/*	<h1>Login</h1>*/}
			{/*	<input type="text" name="username" placeholder="username" onChange={textChangeHandler}></input>*/}
			{/*	<input type="password" name="password" onChange={textChangeHandler}></input>*/}
			{/*	<button onClick={login}>Login</button>*/}
			{/*</div>*/}
		</div>
	);
}

export default Login;