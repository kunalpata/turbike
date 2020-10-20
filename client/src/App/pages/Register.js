// Register.js

import React, { Component, useState, useEffect } from 'react';
import '../bootstrap/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


function Register (){

	const [registerUsername, setRegisterUsername] = useState("");
	const [registerPassword, setRegisterPassword] = useState("");
	const [registerEmail, setRegisterEmail] = useState("");
	const [registerFirstname, setRegisterFirstname] = useState("");
	const [registerLastname, setRegisterLastname] = useState("");
	const [registerStatus, setRegisterStatus] = useState({});

	const register = async () => {
		await fetch('http://localhost:9000/api/register',{
			method: 'POST',
			headers: { 'Content-Type' : 'application/json' },
			body: JSON.stringify({registerUsername, registerPassword, registerEmail, registerFirstname, registerLastname})
			
		})
		.then((res) => { return res.json()})
		.then((res) => { setRegisterStatus(res)})
		.catch((err) => { console.log(err)})
	};

	const textChangeHandler = (e) => {
		let inputName = e.target.name;
		console.log(e.target, inputName)
		switch(inputName){
			case "username":
				setRegisterUsername(e.target.value);
				break;
			case "email":
				setRegisterEmail(e.target.value);
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
						<h1>Register</h1>
						<Form>
							<Form.Group>
								<Form.Label>Username</Form.Label>
								<Form.Control type="text" placeholder="User Name" name = "username" onChange={textChangeHandler} />
							</Form.Group>
							<Form.Group>
								<Form.Label>Password</Form.Label>
								<Form.Control type="password" name = "password" onChange={textChangeHandler} />
							</Form.Group>
							<Form.Group>
								<Form.Label>Email</Form.Label>
								<Form.Control type="email" name = "email" placeholder="abc@test.com" onChange={textChangeHandler} />
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
					
						<Button className = "btn-info" onClick={register}>Register</Button>
					</Col>
					<Col></Col>
				</Row>
				
			</Container>

		</div>
	);
}

/*<input type="text" name="username" placeholder="username" onChange={textChangeHandler}></input>
					<input type="password" name="password" onChange={textChangeHandler}></input>
					<input type="email" name="email" placeholder="abc@test.com" onChange={textChangeHandler}></input>
					<input type="text" name="firstname" placeholder="First Name" onChange={textChangeHandler}></input>
					<input type="text" name="lastname" placeholder="Last Name" onChange={textChangeHandler}></input>
*/

export default Register;
