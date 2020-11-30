// UserDashboard.js

import React, { useState,useEffect } from 'react';
import '../bootstrap/bootstrap.min.css';
import './UserDashboard.css';
import InformSpan from '../components/InformSpan.js';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import {Link, Redirect} from 'react-router-dom';
import Card from "react-bootstrap/Card";

const UserDashboard = (props) => {

    const [isAuthenticated, setIsAuthenticated] = useState(true);

    const fetchUser = async() => {
        await fetch('/api/auth/user')
        .then(res => res.json())
        .then((res) => {
            props.passUser({...res});
            setIsAuthenticated(res.isAuthenticated);
        })
    }

    useEffect(() => {
        fetchUser();
    },[])

    return (
        <Container className="dashboard-body">
            {!isAuthenticated?<Redirect 
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
            <Row className="dashboard-header">
                <h1 className="dashboard-title">Welcome back, {props.userInfo.user!==undefined?props.userInfo.user.first_name+" "+props.userInfo.user.last_name:null}</h1>
            </Row>

            <Row>
                <Col sm={12}><h4 style={{color:"gray",marginTop:"20px"}}>Select one of the following to continue...</h4></Col>
                <Col sm={4}>
                    <Card className="hoverShadow">
                        <Card.Body>
                            <Card.Img variant="top" style={{objectFit:"contain", maxHeight:"200px",background:"none",order:1,margin:"5px"}} src={require("../images/personalform.jpg")} />
                            <Card.Title as={Link} to="/userInfo">Personal Information</Card.Title>
                            <Card.Text>View and update your information</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>

                <Col sm={4}>
                    <Card className="hoverShadow">
                        <Card.Body>
                            <Card.Img variant="top" style={{objectFit:"contain", maxHeight:"200px",background:"none",order:1,margin:"5px"}} src={require("../images/bikeList.jpg")} />
                            <Card.Title as={Link} to="/userBikes">List of Bikes</Card.Title>
                            <Card.Text>See your bikes listed</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>

                <Col sm={4}>
                    <Card className="hoverShadow">
                        <Card.Body>
                            <Card.Img variant="top" style={{objectFit:"contain",maxHeight:"200px",background:"none",order:1,margin:"5px"}} src={require("../images/contracts.jpg")} />
                            <Card.Title as={Link} to={{
                                                        pathname: './userContracts',
                                                        state: {
                                                            userId: props.userInfo.user !== undefined ? props.userInfo.user.id : 0
                                                        }
                                                    }}>Leasing Contracts</Card.Title>
                            <Card.Text>See all your contract details</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );

};

export default UserDashboard;