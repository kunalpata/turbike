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
					<Col md={6}></Col>
					<Col md={6}>
						<div className="boxLayout" style={{marginTop: "15%"}}>
							<Card style={{ width: '30rem', height: '37rem'}} >
								<Container>
								<Link to={"./"} className="linkForLogo">
									<Card.Img variant="top" className="logoImg1" src={require("../images/turbike_logo.png")} />
								</Link>
								<Card.Title className="topText" style={{width:"450px",fontSize:"30px"}}>Let's get right into it!</Card.Title>
								<Card.Body className="cardBody">
										
										<Form>
											<Form.Group>
												<Form.Control type="text" name = "username" placeholder="Username" onChange={textChangeHandler} />
												{checkExist.username? (<InformSpan classname="warningText" textMsg = "*Username in use!" />) : (<div/>)}
											</Form.Group>
											<Form.Group>
												<Form.Control type="password" name = "password" placeholder="Password" onChange={textChangeHandler} />
											</Form.Group>
											<Form.Group>
												<Form.Control type="email" name = "email" placeholder="Email" onChange={textChangeHandler} />
												{checkExist.email? (<InformSpan classname="warningText" textMsg = "*Email in use!" />) : (<div/>)}
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
