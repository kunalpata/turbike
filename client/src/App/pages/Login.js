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

	const login = async () => {
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
					<div className="boxLayout">
						<Card style={{ width: '30rem', height: '20rem' }} >
							<Link to={"./"} className="linkForLogo">
								<Card.Img variant="top" className="logoImg" src={require("../images/turbike_logo.png")} />
							</Link>
							<Card.Body className="cardBody">
								<Card.Text>
									<p className="topText">Login</p>
									<p className="Welcome">Welcome Back!</p>
								</Card.Text>
								<div className="formBox">
									<Form>
										<Form.Control type="text" placeholder="Email" name="email" onChange={textChangeHandler} />
									</Form>
									<Form>
										<Form.Control type="password" placeholder="Password" name="password" onChange={textChangeHandler} />
									</Form>
								</div>
								<div className="loginButton">
									
										<Button type="submit" variant="danger" className="actualButton" conClick={login}>Login</Button>
									
								</div>
								<Card.Text>
									<p className="accountSignUp">Don't have an account? <b><Link to={'./Register'} className="signUp">Sign Up</Link></b></p>
								</Card.Text>
							</Card.Body>


						</Card>
					</div>
				</Row>
			</Container>
      {loginStatus.login? <Redirect to="/" /> : null}
			
		</div>
	);
}

export default Login;
