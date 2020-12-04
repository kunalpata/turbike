// UserAccountInfo.js

import React, { useEffect, useState, useRef } from 'react';
import '../bootstrap/bootstrap.min.css';
import './UserAccountInfo.css';
import InformSpan from '../components/InformSpan.js';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import {Link, Redirect} from 'react-router-dom';
import Card from "react-bootstrap/Card";


function UserAccountInfo (props){
    //console.log(props)
    let {email,first_name,id,last_name,user_name} = props.userInfo.user != null? props.userInfo.user:{email:null,first_name:null,id:null,last_name:null,user_name:null};
	const [newUsername, setNewUsername] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [newEmail, setNewEmail] = useState("");
	const [newFirstname, setNewFirstname] = useState("");
	const [newLastname, setNewLastname] = useState("");
	const [checkStatus, setCheckStatus] = useState({username:{isValid:true},email:{isValid:true},firstname:{isValid:true},lastname:{isValid:true},password:{isValid:true}});
    const [enableButton, setEnableButton] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const saveBtnRef = useRef(null);

    const fetchUser = async() => {
        await fetch('/api/auth/user')
        .then(res => res.json())
        .then((res) => {
            props.passUser({...res});
            setIsAuthenticated(res.isAuthenticated);
        })
    }

	const updateUserInfo = async () => {
		if(checkFields(checkStatus)){
            saveBtnRef.current.disabled = true;
            let newUserObj = {
                user_name : (newUsername != "")?newUsername:null,
                password : (newPassword != "")?newPassword:null,
                email : (newEmail != "")?newEmail:null,
                first_name : (newFirstname != "")?newFirstname:null,
                last_name : (newLastname != "")?newLastname:null,
                userId : props.userInfo.user.id
            };

			await fetch('/api/update/user',{
				method: 'POST',
				headers: { 'Content-Type' : 'application/json' },
				body: JSON.stringify(newUserObj)
				
			})
			.then((res) => { return res.json()})
			.then((res) => { 
                //console.log(res);
                if(res.isAuthenticated != undefined && !res.isAuthenticated){
                    //console.log("not authenticated")
                    setIsAuthenticated(false);
                }else if(res.err != undefined){
                    saveBtnRef.current.textContent = "Error! Try again?";
                    saveBtnRef.current.disabled = false;
                }else{
                    saveBtnRef.current.textContent = "Updated!"
                    props.passUser({...res});
                }
            })
			.catch((err) => { console.log(err)})
		}
	};

	const checkFields = (fieldObj) => {
		let isInputsValid = true;
		for(let key in fieldObj){
			for(let subkey in fieldObj[key]){
				if(fieldObj[key][subkey] === false){
					isInputsValid = false;
				}
			}
		}	
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
                            if(res.isExist && res.matched[0][targetfield] == props.userInfo.user[targetfield]){
                                newCheckStatus[targetKey].isNotExist = true;
                            }
							
							//console.log(newCheckStatus);
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
				setNewUsername(e.target.value);
				inputValidate("username",inputValue);
				await checkIfExist(e.target.value, "user_name", "user", "username");							
				break;
			case "email":
				setNewEmail(e.target.value);
				inputValidate("email",inputValue);
				await checkIfExist(e.target.value, "email", "user", "email");		
				break;
			case "password":
				setNewPassword(e.target.value);
				inputValidate("password",inputValue);
				break;
			case "firstname":
				setNewFirstname(e.target.value);
				inputValidate("firstname",inputValue);
				break;
			case "lastname":
				setNewLastname(e.target.value);
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
		//console.log(targetInput)
		const regex = RegExp(regexPattern);
		return regex.test(targetInput);
    }
    
    useEffect(() => {
        fetchUser();
    },[]);

	return (	
		<Container>
            <div style={{marginTop:"100px"}}>	
                {!isAuthenticated? <Redirect
                                        to={{
                                            pathname: '/login',
                                            state: {
                                                showAlert: true,
                                                warningText: "You must login to continue!",
                                                from: props.location.pathname,
                                                ...props.location.state
                                            }
                                        }}/>:null
                } 		
									
				<Row>
					<Col md={1} xl={2}></Col>
					<Col md={10} xl={8}>
									
                        <Row className="accountHeader" style={{display:"flex", justifyContent:"center"}}><h1>Your Information</h1></Row>
                        <Row style={{display:"flex", flexDirection:"column", justifyContent:"center", flexShrink:0,padding:"30px 30px 0px"}}>
							
                                    <Form.Row>
										<Form.Group style={{flexGrow:1}}>
                                            <Form.Label>Username</Form.Label>
											<Form.Control type="text" name = "username" placeholder="Username" onChange={textChangeHandler} defaultValue={user_name}/>
											{checkStatus.username.isNotExist===false? (<InformSpan classname="warningText" textMsg = "*Username in use!" />) : null}
											{checkStatus.username.isValid===false? (<InformSpan classname="warningText" textMsg={checkStatus.username.errMsg}/>): null}
										</Form.Group>
                                    </Form.Row>
                                    <Form.Row>
										<Form.Group style={{flexGrow:1}}>
                                            <Form.Label>New Password</Form.Label>
											<Form.Control type="password" name = "password" placeholder="Leave it blank to keep old password" onChange={textChangeHandler} />
											{checkStatus.password.isValid===false? (<InformSpan classname="warningText" textMsg={checkStatus.password.errMsg}/>) : null}
										</Form.Group>
                                    </Form.Row>
                                    <Form.Row>
										<Form.Group style={{flexGrow:1}}>
                                            <Form.Label>Email</Form.Label>
											<Form.Control type="email" name = "email" placeholder="Email" onChange={textChangeHandler} defaultValue={email}/>
											{checkStatus.email.isNotExist===false? (<InformSpan classname="warningText" textMsg = "*Email in use!" />) : null}
											{checkStatus.email.isValid===false? (<InformSpan classname="warningText" textMsg={checkStatus.email.errMsg}/>) : null}
										</Form.Group>
                                    </Form.Row>
                                    <Form.Row>
										<Form.Group style={{flexGrow:1}}>
                                            <Form.Label>First Name</Form.Label>
											<Form.Control type="test" name = "firstname" placeholder="First Name" onChange={textChangeHandler} defaultValue={first_name}/>
											{checkStatus.firstname.isValid===false? (<InformSpan classname="warningText" textMsg={checkStatus.firstname.errMsg}/>):null}
										</Form.Group>
                                    </Form.Row>
                                    <Form.Row>
										<Form.Group style={{flexGrow:1}}>
                                            <Form.Label>Last Name</Form.Label>
											<Form.Control type="text" name = "lastname" placeholder="Last Name" onChange={textChangeHandler} defaultValue={last_name}/>
											{checkStatus.lastname.isValid===false? (<InformSpan classname="warningText" textMsg={checkStatus.lastname.errMsg}/>):null}
										</Form.Group>
                                    </Form.Row>
							
                        </Row>																			
                            <Row style={{display:"flex", justifyContent:"center"}}>
								
											<Button className = "btn-danger" style={{width:"150px",margin:"10px"}} ref={(el)=>(saveBtnRef.current=el)} onClick={updateUserInfo} disabled={!enableButton}>Save</Button>	
                                            <Link to='/dashboard'><Button className = "btn-danger" style={{margin:"10px"}}>Return to Dashboard</Button></Link>

                            </Row>
					</Col>
                    <Col md={1} xl={2}></Col>

				</Row>
			</div>
        </Container>        

		
	);
}

export default UserAccountInfo;
