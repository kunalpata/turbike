// Login.js

import React, { useState } from 'react';
import './Login.css';
import { Redirect } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from "react-bootstrap/Card";
import {Link} from "react-router-dom";
import InformSpan from '../components/InformSpan.js';

function Login (props){

	const [loginUsername, setLoginUsername] = useState("");
	const [loginPassword, setLoginPassword] = useState("");
	const [loginStatus, setLoginStatus] = useState({});
	const [enableButton, setEnableButton] = useState(false);
	const [attemptFailed, setAttemptFailed] = useState(false);

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
							if(!res.login){
								setAttemptFailed(true);
							}
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
		let curInput = e.target.value;
		let curInputField = e.target.name;
		setAttemptFailed(false);
		(curInputField === "username") ? setLoginUsername(curInput) : setLoginPassword(curInput);
		//enable login button if both are not empty
		let otherInput = (curInputField==="username")? loginPassword : loginUsername;

		(curInput !== "" && otherInput !== "")?setEnableButton(true):setEnableButton(false);
	}


	return (
		<div className="Login">
			<Container fluid>
				<Row>
					<Col sm={1} xl={2}></Col>
					<Col xl={4} className="colfullpage mobileL ">
						<Card className="mobileL" >

							<Card.Body>
								<Link to={"./"}>
									<Card.Img variant="top" className="logoImg1L" src={require("../images/turbike_logo.png")} />
								</Link>
								<Card.Title className="topTextL" style={{display:"flex", flexFlow:"column", justifyContent:"center"}}>
									<div style={{width:"100%",fontSize:"40px",textAlign:"center",marginBottom:"5px" }}><strong>Login</strong></div>
									<div style={{width:"100%",fontSize:"15px",textAlign:"center" }}>Welcome back!</div>
								</Card.Title>
									
									<Form>
										<Form.Group>
											{attemptFailed?(<InformSpan classname="warningText" textMsg="Incorrect Username and/or Password!"/>):null}
											<Form.Control type="text" placeholder="Username" name="username" onChange={textChangeHandler} />
										</Form.Group>	
										<Form.Group>
											<Form.Control type="password" placeholder="Password" name="password" onChange={textChangeHandler} />
										</Form.Group>	
											
									</Form>
									
									<div className="accountSignUpL">
										<div style={{display:"flex", justifyContent: "center",margin : "10px"}}>
											<Button className = "btn-danger" onClick={login} disabled={!enableButton} style={{minWidth:"200px"}}>Login</Button>										
										</div >
										<div style={{display:"flex", flexFlow:"row wrap", justifyContent: "center"}}>
											<div >{"Don't have an account? "}</div>
											<div><b><Link to={'./Register'} >Sign Up</Link></b></div>
										</div>
										
									</div>
									
							</Card.Body>
						</Card>
					</Col>
				</Row>
			
			</Container>
      			{loginStatus.login? <Redirect to="/" /> : null}
			
		</div>
	);
}

export default Login;
