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
import DismissibleAlert from '../components/DismissibleAlert.js';


function Register (props){
	console.log(props)
	const [regUsername, setRegisterUsername] = useState("");
	const [regPassword, setRegisterPassword] = useState("");
	const [regEmail, setRegisterEmail] = useState("");
	const [regFirstname, setRegisterFirstname] = useState("");
	const [regLastname, setRegisterLastname] = useState("");
	const [registerStatus, setRegisterStatus] = useState({});
	const [checkStatus, setCheckStatus] = useState({username:{},email:{}});
	const [CardHeight, setCardHeight] = useState(37);

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

	const checkFields = (fieldObj) => {
		//set the card height to original value
		let newCardHeight = 37;
		let isInputsValid = true;
		for(let key in fieldObj){
			for(let subkey in fieldObj[key]){
				if(fieldObj[key][subkey] === false){
					newCardHeight += 2;
					isInputsValid = false;
				}
			}
		}
		setCardHeight(newCardHeight);
		return isInputsValid;
	}

	const checkIfExist = async (target, targetfield, tableName, targetKey) => {
		await fetch('/api/check/checkRegisterInfo',{
			method: 'POST',
			headers: { 'Content-Type' : 'application/json' },
			body: JSON.stringify({target, targetfield, tableName})
		})
		.then((res) => {return res.json()})
		.then((res) => {
							let newCheckStatus = {...checkStatus};
							newCheckStatus[targetKey].isNotExist = !res.isExist;
							
							console.log(newCheckStatus);
							setCheckStatus(newCheckStatus);
					   })
		.catch((err) => {console.log(err)});
	}


	const textChangeHandler = async (e) => {
		let inputName = e.target.name;
		console.log(e.target, inputName)
		switch(inputName){
			case "username":
				setRegisterUsername(e.target.value);
				await checkIfExist(e.target.value, "user_name", "user", "username");				
				break;
			case "email":
				setRegisterEmail(e.target.value);
				await checkIfExist(e.target.value, "email", "user", "email");		
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
		//check all inputs
		checkFields(checkStatus);
	}


	const inputValidate = (inputType, curInput) => {
		let result = {isValid:true,errMsg:""};
		switch(inputType){
			case "username":
				//setRegisterUsername(e.target.value);
				//await checkIfExist(e.target.value, "user_name", "user", "username");				
				break;
			case "email":
				//setRegisterEmail(e.target.value);
				//await checkIfExist(e.target.value, "email", "user", "email");		
				break;
			case "password":
				//setRegisterPassword(e.target.value);
				break;
			case "firstname":
			case "lastname":
				curInput = curInput.replace(/^\s+/,'');
				curInput = curInput.replace(/\s+$/,'');
				//(curInput != "")?setWarning(htmlID, 1):setWarning(htmlID,0);
				break;

		}
		
	}

	/* This function performs extensive input test using regular expression.*/
	const inputTest = (regexPattern, targetInput) => {
		const regex = RegExp(regexPattern);
		return regex.test(targetInput);
	}

	return (
		<div className="Register">
			<Container>
				<Row>
					<Col md={6}></Col>
					<Col md={6}>
						<div className="boxLayout" style={{marginTop: "15%"}}>
							<Card style={{ width: '30rem', height: CardHeight+"rem"}} >
								<Container>
								<Link to={"./"} className="linkForLogo">
									<Card.Img variant="top" className="logoImg1" src={require("../images/turbike_logo.png")} />
								</Link>
								<Card.Title className="topText" style={{width:"450px",fontSize:"30px"}}>Let's get right into it!</Card.Title>
								<Card.Body className="cardBody">
										
										<Form>
											<Form.Group>
												<Form.Control type="text" name = "username" placeholder="Username" onChange={textChangeHandler} />
												{checkStatus.username.isNotExist===false? (<InformSpan classname="warningText" textMsg = "*Username in use!" />) : null}
											</Form.Group>
											<Form.Group>
												<Form.Control type="password" name = "password" placeholder="Password" onChange={textChangeHandler} />
											</Form.Group>
											<Form.Group>
												<Form.Control type="email" name = "email" placeholder="Email" onChange={textChangeHandler} />
												{checkStatus.email.isNotExist===false? (<InformSpan classname="warningText" textMsg = "*Email in use!" />) : null}
											</Form.Group>
											<Form.Group>
												<Form.Control type="test" name = "firstname" placeholder="First Name" onChange={textChangeHandler} />
											</Form.Group>
											<Form.Group>
												<Form.Control type="text" name = "lastname" placeholder="Last Name" onChange={textChangeHandler} />
											</Form.Group>
										</Form>
										
									
									
										<div style={{fontSize: "12px", margin:"10px"}}>
											By selecting <strong>{"Agree & Continue"}</strong> below, you agree to Turbike's Terms of Service, Payment Terms of Service and Privacy Policy
										</div>
									<div className="accountSignUp">
										<div style={{margin : "10px"}}>
										<Button className = "btn-danger" onClick={register}>{"Agree & Continue"}</Button>
										{registerStatus.isRegister? <Redirect to='/'/>:null}
										</div>
										
										<div>Already have an account? <b><Link to={'./Login'} className="signUp">Log in</Link></b></div>
									</div>
								</Card.Body>
								
								</Container>
							</Card>
						</div>
					</Col>
				</Row>
				
			</Container>
			
		</div>
		
	);
}

export default Register;
