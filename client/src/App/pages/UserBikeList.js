// UserBikeList.js

import React, {useEffect, useState} from 'react';
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
import Table from "../components/Table";
import BikeEditCards from "../components/BikeEditCards";

const UserBikeList = (props) => {

    const [bikes, setBikes] = useState({});

    const lookForMatch = async() => {
        // console.log("HERE IN LOOKFORMATCH");

        // get the current user to send
        const data = await fetch('/api/auth/user')
            .catch((err)=>{console.log(err)});

        const currentUser = await data.json()
            .then((currentUser)=>{
                if (currentUser.isAuthenticated) {
                    // console.log("IN IF");
                    // console.log(currentUser.user.last_name);
                    fetch('/api/getBikes/submittedBikes', {
                        method: 'POST',
                        headers: { 'Content-Type' : 'application/json'},
                        body: JSON.stringify({...currentUser})
                    })
                    .then((res) => {return res.json()})
                    .then(async (res) => {
                        // console.log("REQ")
                        if (!res.hasError) {
                            // console.log(res)
                            setBikes(res);
                        }
                    })
                }
            })
            .catch((err)=>{console.log(err)});


    };


    const printBike = () => {
        console.log(bikes);
    };

    useEffect(() => {
        lookForMatch();
    }, []);


    return (
        <Container className="dashboard-body">
            <Row>
                <h1 className="dashboard-title" style={{marginTop: "40px"}}>My Bikes</h1>
                {(bikes.hasOwnProperty("hasError") && !bikes.hasError) ?
                    (<BikeEditCards bikes={bikes.data}/>):"LOADING..."
                }

            </Row>

        </Container>


    )

};

export default UserBikeList;