// UserAccountInfo.js

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


const UserAccountInfo = (props) => {
    return (
        <Container className="dashboard-body">
            <Row>
                <Col>
                    <h3 className="dashboard-title">First Name: {props.userInfo.user !== undefined?props.userInfo.user.first_name:null}</h3>
                    <hr/>
                    <h3 className="dashboard-title">Last Name: {props.userInfo.user !== undefined?props.userInfo.user.last_name:null}</h3>
                    <hr/>
                    <h3 className="dashboard-title">Username: {props.userInfo.user !== undefined?props.userInfo.user.user_name:null}</h3>
                    <hr/>
                    <h3 className="dashboard-title">Email: {props.userInfo.user !== undefined?props.userInfo.user.email:null}</h3>
                </Col>

                <Col>
                    <h3>HEllo</h3>
                </Col>
            </Row>




        </Container>
    );

};

export default UserAccountInfo;