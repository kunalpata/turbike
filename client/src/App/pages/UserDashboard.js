// UserDashboard.js

import React, { useState } from 'react';
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



    return (
        <Container className="dashboard-body">
            <Row>
                <h1 className="dashboard-title">My Dashboard</h1>
            </Row>

            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <Card.Img variant="top" src={require("../images/turbike_logo.png")} />
                            <Card.Title as={Link} to="/">Personal Information</Card.Title>
                            <Card.Text>Enter and edit your information for ways to contact you</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>

                <Col>
                    <Card>
                        <Card.Body>
                            <Card.Img variant="top" src={require("../images/turbike_logo.png")} />
                            <Card.Title as={Link} to="/">List of Bikes</Card.Title>
                            <Card.Text>See your bikes listed</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>

                <Col>
                    <Card>
                        <Card.Body>
                            <Card.Img variant="top" src={require("../images/turbike_logo.png")} />
                            <Card.Title as={Link} to="/">Personal Information</Card.Title>
                            <Card.Text>Enter and edit your information for ways to contact you</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );

};

export default UserDashboard;