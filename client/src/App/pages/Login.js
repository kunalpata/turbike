// Login.js

import React, { Component , useEffect, useState} from 'react';
import { Redirect } from 'react-router-dom';
import '../App.css';

import MyNavbar from "../components/MyNavbar";


function Login (){

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

	const logout = async () => {
		await fetch('/api/auth/logout')
		.then((res) => {return res.json()})
		.then((res) => {console.log(res)})
		.catch((err) => {console.log(err)});
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
			<div>
				<h1>Login</h1>
				<input type="text" name="username" placeholder="username" onChange={textChangeHandler}></input>
				<input type="password" name="password" onChange={textChangeHandler}></input>
				<button onClick={login}>Login</button>
				{loginStatus.login? <Redirect to="/" /> : null}
				<br/>
				<button onClick={getUser}>Get User</button>
				<br/>
				<button onClick={logout}>Log Out</button>
			</div>
		</div>
	);
}

export default Login;