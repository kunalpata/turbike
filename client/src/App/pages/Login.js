// Login.js

import React, { Component , useEffect, useState} from 'react';
import '../App.css';

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
			<div>
				<h1>Login</h1>
				<input type="text" name="username" placeholder="username" onChange={textChangeHandler}></input>
				<input type="password" name="password" onChange={textChangeHandler}></input>
				<button onClick={login}>Login</button>
			</div>
		</div>
	);
}

export default Login;