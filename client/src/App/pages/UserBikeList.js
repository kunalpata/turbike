// UserBikeList.js

import React, {useEffect, useState} from 'react';
import '../bootstrap/bootstrap.min.css';
import './UserBikeList.css';
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
    const [isAuthenticated,setIsAuthenticated] = useState(true);
    const [fetchBikeMsg, setFetchBikeMsg] = useState("Loading...");

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
                    setFetchBikeMsg("Loading...");
                    setIsAuthenticated(true);
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
                        }else{
                            setFetchBikeMsg("Error getting bikes from server");
                        }
                    })
                }else{
                    setIsAuthenticated(false);
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
        <Container>
            {!isAuthenticated?<Redirect
                                    to={{
                                        pathname: '/login',
                                        state: {
                                            showAlert: true,
                                            warningText: "You must login to continue!",
                                            from: props.location.pathname,
                                            ...props.location.state
                                        }
                                    }}/>:null}
            <div style={{marginTop:"100px"}}>       

            <Row>
                <Col sm={2}></Col>
                <Col sm={8}>
                    <Row className="bikeHeader" style={{display:"flex", justifyContent:"center"}}>
                        <h1>My Bikes</h1>
                    </Row>
                    <Row style={{display:"flex", justifyContent:"center"}}>
                        {(bikes.hasOwnProperty("hasError") && !bikes.hasError) ?
                            bikes.data.length?
                            (<BikeEditCards bikes={bikes.data}/>)
                            :
                            <div style={{display:"inline"}}>
                                <span>Have a bike to share?</span>
                                <Link to='/bikeAdd'><Button variant="danger" style={{marginLeft:"10px",marginRight:"10px"}}>List Here</Button></Link>
                                <Link to='/dashboard'><Button variant="danger">Return to Dashboard</Button></Link>
                            </div>
                            :
                            <p>{fetchBikeMsg}</p>
                        }
                    </Row>
                </Col>
                <Col sm={2}></Col>

            </Row>
            </div>

        </Container>


    )

};

export default UserBikeList;