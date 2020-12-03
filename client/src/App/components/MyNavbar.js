// Navbar.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './MyNavbar.css';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import NavDropdown from 'react-bootstrap/NavDropdown'
import DismissibleAlert from './DismissibleAlert.js';

const MyNavbar = (props) => {
  //const {user} = props.userInfo;
  let location = props.location || {pathname:'/',state:{}};
  let curUser = props.userInfo.user || {isAuthenticated:false};
  const [isLoggingOut, setLoggingOut] = useState(false);
  const logout = async () => {
		await fetch('/api/auth/logout')
		.then((res) => {return res.json()})
		.then((res) => {
                      setLoggingOut(res.isLogOut);
                      props.passUser({isAuthenticated:false,user:{}});

                    })
		.catch((err) => {console.log(err)});
	};


  useEffect(()=>{
    if(props.userInfo.isAuthenticated){
      setLoggingOut(false);
    }
  },[props.userInfo]);

  // Add background color to navbar if not at top
  // Source: https://stackoverflow.com/questions/59510990/
  let listener = null;
  const [scrollState, setScrollState] = useState("top");

  useEffect(() => {
    listener = document.addEventListener("scroll", e => {
      let scrolled = document.scrollingElement.scrollTop;

      if (scrolled >= 1) {
        if (scrollState !== "scrolling") {
          setScrollState("scrolling");
        } 
      } else {
        if (scrollState !== "top") {
          setScrollState("top");
        }
      }
    })
    return () => {
      document.removeEventListener("scroll", listener);
    }
  }, [scrollState]);

	return (
	  <Navbar id="mobile-background" expand="md" fixed="top" style={{backgroundColor: scrollState === "top" ? null : '#F3F3F3'}} >
        <Navbar.Brand as={Link} to="./">
          <img alt="turbike logo" src={require("../images/logo_black_200.png")} height="100" width="100"/>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Link as={Link} to="./advancedSearch">Advanced Search</Nav.Link>
          	{
              props.userInfo.isAuthenticated ?
              (

              <NavDropdown title={`Welcome back, ${props.userInfo.user.first_name}`} id="collapsible-nav-dropdown">
                <NavDropdown.Item href="./bikeAdd">List your bike</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="/dashboard">My Dashboard</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={logout}>Log Out</NavDropdown.Item>
              </NavDropdown>)
              : <Nav.Link as={Link} to={{
                                          pathname: '/login',
                                          state: {
                                              from: location.pathname,
                                              ...location.state
                                              
                                          }
                                       }}>Log In</Nav.Link>
            }
            {
              !props.userInfo.isAuthenticated ?
              <Nav.Link as={Link} to={{
                                        pathname: '/register',
                                        state: {
                                            from: location.pathname,
                                            ...location.state
                                        }
                                      }}>Sign up
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
                      />:null}
    </Navbar>
	)
};

export default MyNavbar;