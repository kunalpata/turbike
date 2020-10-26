// Register.js

import React, { Component, useState, useEffect } from 'react';
import '../bootstrap/bootstrap.min.css';
import './Register.css';
import InformSpan from '../components/InformSpan.js';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {Link, Redirect} from 'react-router-dom';
import Card from "react-bootstrap/Card";


function Register (props){
	console.log(props)
	const [regUsername, setRegisterUsername] = useState("");
	const [regPassword, setRegisterPassword] = useState("");
	const [regEmail, setRegisterEmail] = useState("");
	const [regFirstname, setRegisterFirstname] = useState("");
	const [regLastname, setRegisterLastname] = useState("");
	const [registerStatus, setRegisterStatus] = useState({});
	const [checkExist, setCheckStatus] = useState({});

	const register = async () => {
		await fetch('/api/auth/register',{
			method: 'POST',
			headers: { 'Content-Type' : 'application/json' },
			body: JSON.stringify({regUsername, regPassword, regEmail, regFirstname, regLastname})
			
		})
		.then((res) => { return res.json()})
		.then((res) => { setRegisterStatus(res); console.log(res)})
		.catch((err) => { console.log(err)})
	};


	const checkIfExist = async (target, targetfield, tableName, targetKey) => {
		await fetch('/api/check/checkRegisterInfo',{
			method: 'POST',
			headers: { 'Content-Type' : 'application/json' },
			body: JSON.stringify({target, targetfield, tableName})
		})
		.then((res) => {return res.json()})
		.then((res) => {
							let newCheckStatus = {...checkExist};
							newCheckStatus[targetKey] = res.isExist?true:false;
							setCheckStatus(newCheckStatus);
					   })
		.catch((err) => {console.log(err)});
	}

	const textChangeHandler = (e) => {
		let inputName = e.target.name;
		console.log(e.target, inputName)
		switch(inputName){
			case "username":
				setRegisterUsername(e.target.value);
				checkIfExist(e.target.value, "user_name", "user", "username");				
				break;
			case "email":
				setRegisterEmail(e.target.value);
				checkIfExist(e.target.value, "email", "user", "email");		
				break;
			case "password":
				setRegisterPassword(e.target.value);
				break;
			case "firstname":
				setRegisterFirstname(e.target.value);
				break;
			case "lastname":
				setRegisterLastname(e.target.value);
				break;

		}
	}

	

	return (
		<div className="Register">
			<Container>
				<Row>
					<Col></Col>
					<Col xs={6}>
						<div className="boxLayout">
							<Card style={{ width: '30rem', height: '40rem' }} >
								<Link to={"./"} className="linkForLogo">
									<Card.Img variant="top" className="logoImg" src={require("../images/turbike_logo.png")} />
								</Link>
								<Card.Body className="cardBody">
									<div className="formBox">
										<Form>
											<Form.Group>
												<Form.Label>Username</Form.Label>
												<Form.Control type="text" name = "username" onChange={textChangeHandler} />
												{checkExist.username? (<InformSpan classname="warningText" textMsg = "*Username in use!" />) : (<div/>)}
											</Form.Group>
											<Form.Group>
												<Form.Label>Password</Form.Label>
												<Form.Control type="password" name = "password" onChange={textChangeHandler} />
											</Form.Group>
											<Form.Group>
												<Form.Label>Email</Form.Label>
												<Form.Control type="email" name = "email" onChange={textChangeHandler} />
												{checkExist.email? (<InformSpan classname="warningText" textMsg = "*Email in use!" />) : (<div/>)}
											</Form.Group>
											<Form.Group>
												<Form.Label>First Name</Form.Label>
												<Form.Control type="test" name = "firstname" onChange={textChangeHandler} />
											</Form.Group>
											<Form.Group>
												<Form.Label>Last Name</Form.Label>
												<Form.Control type="text" name = "lastname" onChange={textChangeHandler} />
											</Form.Group>
										</Form>
										<Button className = "btn-danger" onClick={register}>Register</Button>
										{registerStatus.isRegister? <Redirect to='/'/>:null}
									</div>
									<Card.Text>
										<p className="accountSignUp">Already have an account? <b><Link to={'./Login'} className="signUp">Log in</Link></b></p>
									</Card.Text>
								</Card.Body>
								<h1 className="topText">Register</h1>
							</Card>
						</div>
					</Col>
				</Row>
				
			</Container>

		</div>
	);
}

export default Register;
