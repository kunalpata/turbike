// Navbar.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import NavDropdown from 'react-bootstrap/NavDropdown'

const MyNavbar = (props) => {
  console.log(props);
  //const {user} = props.userInfo;
	return (
	  <Navbar expand="md" fixed="top">
        <Navbar.Brand as={Link} to="./">Turbike
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
                <NavDropdown.Item href="/logout">Log Out</NavDropdown.Item>
              </NavDropdown>)
              : <Nav.Link as={Link} to="./login">Log In</Nav.Link>
            }
            <Nav.Link as={Link} to="./register">Sign up 
              <FontAwesomeIcon className="user-icon" icon={faUser} />
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
	)
};

export default MyNavbar;