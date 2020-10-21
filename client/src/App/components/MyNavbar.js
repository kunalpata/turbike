// Navbar.js

import React from 'react';
import { Link } from 'react-router-dom';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const MyNavbar = (props) => {
	return (
	  <Navbar expand="md" fixed="top">
        <Navbar.Brand as={Link} to="./">Turbike
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
          	<Nav.Link as={Link} to="#">List your bike</Nav.Link>
          	<Nav.Link as={Link} to="./login">Log in</Nav.Link>
            <Nav.Link as={Link} to="./register">Sign up 
              <FontAwesomeIcon className="user-icon" icon={faUser} />
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
	)
};

export default MyNavbar;