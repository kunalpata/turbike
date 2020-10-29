// Navbar.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import NavDropdown from 'react-bootstrap/NavDropdown'
import DismissibleAlert from './DismissibleAlert.js';

const MyNavbar = (props) => {
  console.log(props);
  //const {user} = props.userInfo;
  const [isLoggingOut, setLoggingOut] = useState(false);
  const logout = async () => {
		await fetch('/api/auth/logout')
		.then((res) => {return res.json()})
		.then((res) => {
                      console.log(res);
                      setLoggingOut(res.isLogOut);
                      props.passUser({isAuthenticated:false,user:{}});

                    })
		.catch((err) => {console.log(err)});
	};

  const ResetLoggingOut = () => {
    setLoggingOut(false);
  }

	return (
	  <Navbar expand="md" fixed="top">
        <Navbar.Brand as={Link} to="./">
          <img alt="turbike logo" src={require("../images/logo_black_200.png")} height="100" width="100"/>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
          	<Nav.Link as={Link} to="#">List your bike</Nav.Link>
          	{
              props.userInfo.isAuthenticated ? 
              (
              <NavDropdown title={`Welcome back, ${props.userInfo.user.first_name}`}id="collasible-nav-dropdown">
                <NavDropdown.Item href="/">My Dashboard</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={logout}>Log Out</NavDropdown.Item>
              </NavDropdown>)
              : <Nav.Link as={Link} to="./login">Log In</Nav.Link>
            }
            {
              !props.userInfo.isAuthenticated ?
              <Nav.Link as={Link} to="./register">Sign up 
                <FontAwesomeIcon className="user-icon" icon={faUser} />
              </Nav.Link>
              :
              null
            }
            
          </Nav>
        </Navbar.Collapse>
        {isLoggingOut? <DismissibleAlert 
                          title="Logging Out" 
                          message="You have logged out successfully!" 
                          type = "info"
                          redirectLink="/" 
                          shouldRedirect={true}
                          duration={2000}
                          parentCleanup={ResetLoggingOut}
                      />:null}
    </Navbar>
	)
};

export default MyNavbar;