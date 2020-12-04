// Login.js

import React, { useState, useRef} from 'react';
import './Login.css';
import { Redirect, useHistory } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from "react-bootstrap/Card";
import {Link} from "react-router-dom";
import InformSpan from '../components/InformSpan.js';
import DismissibleAlert from '../components/DismissibleAlert.js';

function Login (props){
	//console.log("login route")
	//console.log(props);
	const [loginUsername, setLoginUsername] = useState("");
	const [loginPassword, setLoginPassword] = useState("");
	const [loginStatus, setLoginStatus] = useState({});
	const [enableButton, setEnableButton] = useState(false);
	const [attemptFailed, setAttemptFailed] = useState(false);
	const btnRef = useRef(null);
	const history = useHistory();

	const login = async () => {
		btnRef.current.disabled = true;
		btnRef.current.textContent = "login";
		setAttemptFailed(false);
		await fetch('/api/auth/login',{
			method: 'POST',
			headers: { 'Content-Type' : 'application/json' },
			body: JSON.stringify({username:loginUsername, password:loginPassword})
			
		})
		.then((res) => { return res.json()})
		.then((res) => { 
							//console.log(res);
							if(res.login != undefined){
								setLoginStatus(res);
								props.passUser({isAuthenticated:res.login,user:res.user});
								if(!res.login){
									setAttemptFailed(true);
									btnRef.current.disabled = false;
								}
							}else{
								btnRef.current.textContent = "Server Error! Retry?";
								btnRef.current.disabled = false;
							}
						})
		.catch((err) => { 
			//console.log(err);
			btnRef.current.textContent = "Server Error! Retry?";
			btnRef.current.disabled = false;
		})
	};


	const textChangeHandler = (e) => {
		let curInput = e.target.value;
		let curInputField = e.target.name;
		setAttemptFailed(false);
		(curInputField === "username") ? setLoginUsername(curInput) : setLoginPassword(curInput);
		//enable login button if both are not empty
		let otherInput = (curInputField==="username")? loginPassword : loginUsername;

		(curInput !== "" && otherInput !== "")?setEnableButton(true):setEnableButton(false);
	}

	const handleKeypress = (e) => {
		if (e.charCode === 13){
			btnRef.current.click();
		}
	}

	return (
		<div className="Login">
			<Container fluid>
				{(props.location.state != undefined) && (props.location.state.showAlert === true)? <DismissibleAlert
													title="Warning"
													message={props.location.state.warningText}
													type="danger"
													redirectLink=""
													shouldRedirect={false}
													duration={5000}
												/>:null}
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
											<Form.Control type="text" placeholder="Username" name="username" onKeyPress={handleKeypress} onChange={textChangeHandler} />
										</Form.Group>	
										<Form.Group>
											<Form.Control type="password" placeholder="Password" name="password" onKeyPress={handleKeypress} onChange={textChangeHandler} />
										</Form.Group>	
											
									</Form>
									
									<div className="accountSignUpL">
										<div style={{display:"flex", justifyContent: "center",margin : "10px"}}>
											<Button className = "btn-danger" onClick={login} ref={btnRef} disabled={!enableButton} style={{minWidth:"200px"}}>Login</Button>										
										</div >
										<div style={{display:"flex", flexFlow:"row wrap", justifyContent: "center"}}>
											<div >{"Don't have an account? "}</div>
											<div><b><Link to={{
																pathname: '/register',
																state: {
																	from: props.location.state.from,
																	...props.location.state
																}
															  }} >Sign Up</Link></b></div>
										</div>
										
									</div>
									
							</Card.Body>
						</Card>
					</Col>
				</Row>
			
			</Container>
      		{loginStatus.login? history.push(props.location.state.from,props.location.state) : null}
			
		</div>
	);
}

export default Login;
