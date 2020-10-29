// Login.js

import React, { Component , useEffect, useState} from 'react';
import './Login.css';
import { Redirect } from 'react-router-dom';
import './Login.css';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from "react-bootstrap/Card";
import {Link} from "react-router-dom";

function Login (props){

	const [loginUsername, setLoginUsername] = useState("");
	const [loginPassword, setLoginPassword] = useState("");
	const [loginStatus, setLoginStatus] = useState({});
	const [enableButton, setEnableButton] = useState(false);

	const login = async () => {
		console.log(loginUsername, loginPassword);
		await fetch('/api/auth/login',{
			method: 'POST',
			headers: { 'Content-Type' : 'application/json' },
			body: JSON.stringify({username:loginUsername, password:loginPassword})
			
		})
		.then((res) => { return res.json()})
		.then((res) => { 
							console.log(res);
							setLoginStatus(res);
							props.passUser({isAuthenticated:res.login,user:res.user});
						})
		.catch((err) => { console.log(err)})
	};

	const getUser = async () => {
		await fetch('/api/auth/user')
		.then((res) => {return res.json()})
		.then((res) => {console.log(res)})
		.catch((err) => {console.log(err)});
	}

	const textChangeHandler = (e) => {
		(e.target.name === "username") ? setLoginUsername(e.target.value) :
			setLoginPassword(e.target.value);
	}

	return (
		<div className="Login">
			<Container>
				<Row>
					
					<Col md={6}>
					<div className="boxLayout" style={{marginTop: "15%"}}>
						<Card style={{ width: '30rem', height: '27rem' }} >
							<Container>
								<Link to={"./"} className="linkForLogo">
									<Card.Img variant="top" className="logoImg1" src={require("../images/turbike_logo.png")} />
								</Link>
								<Card.Title className="topText" style={{display:"flex", flexWrap:"wrap", justifyContent:"center"}}>
									<div style={{width:"450px",fontSize:"40px",textAlign:"center" }}>Login</div>
									<div style={{width:"450px",fontSize:"15px",textAlign:"center",margin:"10px" }}>Welcome back!</div>
								</Card.Title>
								
								<Card.Body className="cardBody">
									
									
									<Form>
										<Form.Group>
											<Form.Control type="text" placeholder="Username" name="username" onChange={textChangeHandler} />
										</Form.Group>	
										<Form.Group>
											<Form.Control type="password" placeholder="Password" name="password" onChange={textChangeHandler} />
										</Form.Group>	
											
									</Form>
									
									<div className="accountSignUp">
										<div style={{margin : "10px"}}>
											<Button className = "btn-danger" onClick={login} disabled={!enableButton}>Login</Button>										
										</div>
										
										<div>Don't have an account? <b><Link to={'./Register'} className="signUp">Sign Up</Link></b></div>
									</div>
									
								</Card.Body>
							</Container>
							
						</Card>
					</div>
					</Col>
					<Col md={6}></Col>
				</Row>
			</Container>
      			{loginStatus.login? <Redirect to="/" /> : null}
			
		</div>
	);
}

export default Login;
