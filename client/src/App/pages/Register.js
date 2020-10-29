// Register.js

import React, { useState } from 'react';
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
	const [checkStatus, setCheckStatus] = useState({username:{},email:{},firstname:{},lastname:{},password:{}});
	const [CardHeight, setCardHeight] = useState(37);
	const [enableButton, setEnableButton] = useState(false);

	const register = async () => {
		if(checkFields(checkStatus)){
			await fetch('/api/auth/register',{
				method: 'POST',
				headers: { 'Content-Type' : 'application/json' },
				body: JSON.stringify({regUsername, regPassword, regEmail, regFirstname, regLastname})
				
			})
			.then((res) => { return res.json()})
			.then((res) => { setRegisterStatus(res); console.log(res)})
			.catch((err) => { console.log(err)})
		}
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
		setEnableButton(isInputsValid);
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
		let inputValue = e.target.value;
		console.log(e.target, inputName)
		switch(inputName){
			case "username":
				setRegisterUsername(e.target.value);
				inputValidate("username",inputValue);
				await checkIfExist(e.target.value, "user_name", "user", "username");							
				break;
			case "email":
				setRegisterEmail(e.target.value);
				inputValidate("email",inputValue);
				await checkIfExist(e.target.value, "email", "user", "email");		
				break;
			case "password":
				setRegisterPassword(e.target.value);
				inputValidate("password",inputValue);
				break;
			case "firstname":
				setRegisterFirstname(e.target.value);
				inputValidate("firstname",inputValue);
				break;
			case "lastname":
				setRegisterLastname(e.target.value);
				inputValidate("lastname",inputValue);
				break;

		}
		//check all inputs
		checkFields(checkStatus);
	}


	const inputValidate = (inputType, curInput) => {
		let result = {isValid:true,errMsg:""};
		switch(inputType){
			case "username":
				curInput = curInput.replace(/^\s+/,'');
				curInput = curInput.replace(/\s+$/,'');	
				if(curInput.length == 0){
					result.isValid = false;
					result.errMsg = "*Cannot be blank!";
				}		
				break;
			case "email":
				curInput = curInput.replace(/^\s+/,'');
				curInput = curInput.replace(/\s+$/,'');
				if(!inputTest(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,curInput)){
					result.isValid = false;
					result.errMsg = "*Not a valid email address!"
				}
				break;
			case "password":
				if(!inputTest(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/,curInput)){
					result.isValid = false;
					result.errMsg = "*1 or more numbers, 1 uppercase, 1 lowercase letter";
				}
				break;
			case "firstname":
			case "lastname":
				curInput = curInput.replace(/^\s+/,'');
				curInput = curInput.replace(/\s+$/,'');
				if(curInput.length == 0){
					result.isValid = false;
					result.errMsg = "*Cannot be blank!";
				}
				break;

		}

		//update checkStatus
		let newStatus = {...checkStatus};
		newStatus[inputType].isValid = result.isValid;
		newStatus[inputType].errMsg = result.errMsg;
		setCheckStatus(newStatus);
		
	}

	/* This function performs extensive input test using regular expression.*/
	const inputTest = (regexPattern, targetInput) => {
		console.log(targetInput)
		const regex = RegExp(regexPattern);
		return regex.test(targetInput);
	}

	return (
		<div className="Register">
			<Container>	
				{registerStatus.isRegister? <DismissibleAlert 
												title="Account Created!" 
												message="Account created successfully! Please login." 
												type = "info"
												redirectLink="/login" 
												shouldRedirect={true}
												duration={5000}
												parentCleanup={()=>{}}
											/>:null}													
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
												{checkStatus.username.isValid===false? (<InformSpan classname="warningText" textMsg={checkStatus.username.errMsg}/>): null}
											</Form.Group>
											<Form.Group>
												<Form.Control type="password" name = "password" placeholder="Password" onChange={textChangeHandler} />
												{checkStatus.password.isValid===false? (<InformSpan classname="warningText" textMsg={checkStatus.password.errMsg}/>) : null}
											</Form.Group>
											<Form.Group>
												<Form.Control type="email" name = "email" placeholder="Email" onChange={textChangeHandler} />
												{checkStatus.email.isNotExist===false? (<InformSpan classname="warningText" textMsg = "*Email in use!" />) : null}
												{checkStatus.email.isValid===false? (<InformSpan classname="warningText" textMsg={checkStatus.email.errMsg}/>) : null}
											</Form.Group>
											<Form.Group>
												<Form.Control type="test" name = "firstname" placeholder="First Name" onChange={textChangeHandler} />
												{checkStatus.firstname.isValid===false? (<InformSpan classname="warningText" textMsg={checkStatus.firstname.errMsg}/>):null}
											</Form.Group>
											<Form.Group>
												<Form.Control type="text" name = "lastname" placeholder="Last Name" onChange={textChangeHandler} />
												{checkStatus.lastname.isValid===false? (<InformSpan classname="warningText" textMsg={checkStatus.lastname.errMsg}/>):null}
											</Form.Group>
										</Form>
										
									
									
										<div style={{fontSize: "12px", margin:"10px"}}>
											By selecting <strong>{"Agree & Continue"}</strong> below, you agree to Turbike's Terms of Service, Payment Terms of Service and Privacy Policy
										</div>
									<div className="accountSignUp">
										<div style={{margin : "10px"}}>
										<Button className = "btn-danger" onClick={register} disabled={!enableButton}>{"Agree & Continue"}</Button>
										
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
