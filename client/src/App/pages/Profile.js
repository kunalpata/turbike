// Profile.js

import React, { useState,useEffect } from 'react';
import '../bootstrap/bootstrap.min.css';
import './Profile.css';
import InformSpan from '../components/InformSpan.js';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import {Link, Redirect} from 'react-router-dom';
import Card from "react-bootstrap/Card";

import ProfileRatings from "../components/ProfileRatings";
import BikeCards from "../components/BikeCards";

const Profile = (props) => {

    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [curUser, setCurUser] = useState({});
    const [hostRating, setHostRating] = useState({});
    const [reviewerNames, setReviewerNames] = useState([]);
    const [bikes, setBikes] = useState({});


    const fetchUser = async() => {
        await fetch('/api/auth/user')
            .then(res => res.json())
            .then((res) => {
                props.passUser({...res});
                setIsAuthenticated(res.isAuthenticated);
                setCurUser(res.user);
            })
    };

    const fetchRating = async() => {

        const data = await fetch('/api/auth/user')
            .catch((err)=>{console.log(err)});

        const currentUser = await data.json()
            .then((currentUser) => {
                if (currentUser.isAuthenticated) {
                    fetch('/api/get/profileRating', {
                        method: 'POST',
                        headers: { 'Content-Type' : 'application/json'},
                        body: JSON.stringify({...currentUser})
                    })
                        .then((res) => {return res.json()})
                        .then(async (res) => {
                            if (!res.hasError) {
                                // console.log(res);
                                setHostRating(res);
                            }
                            else {
                                setHostRating(res);
                            }
                        })
                }
            })
    };

    const fetchRatedBy = async() => {
        const data = await fetch('/api/auth/user')
            .catch((err)=>{console.log(err)});

        const currentUser = await data.json()
            .then((currentUser) => {
                if (currentUser.isAuthenticated) {
                    fetch('/api/get/ratedUser', {
                        method: 'POST',
                        headers: { 'Content-Type' : 'application/json'},
                        body: JSON.stringify({...currentUser})
                    })
                        .then((res) => {return res.json()})
                        .then(async (res) => {
                            if (!res.hasError) {
                                // console.log(res);
                                setReviewerNames(res);
                            }
                        })
                }
            })
    };

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

    function testPrint(test) {
        console.log(test)
    }

    useEffect(() => {
        fetchUser();
        fetchRating();
        fetchRatedBy();
        lookForMatch();
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

            {/*{reviewerNames.hasOwnProperty("hasError") && !reviewerNames.hasError}*/}
            <Row>
                <Col sm={{span: 5, offset: 0}}>
                    <Card>
                        <Card.Img variant="top" src={require("../images/user-icon.png")} height="auto" width="auto" />
                        <Card.Title className="dashboard-title">Hello, my name is {props.userInfo.user!==undefined?props.userInfo.user.first_name:null}</Card.Title>
                        <Card.Body>
                            {(hostRating.hasOwnProperty("hasError") && !hostRating.hasError && curUser!==undefined) ?
                                (
                                    <div>
                                        <img alt="cancel bike" src={require("../images/star.png")} height="30vh" width="30vh" style={{marginBottom: "15px", display:"inline"}}/>
                                        <h3 style={{marginLeft: "10px", display:"inline"}}>{hostRating.rating_details.length} reviews</h3>
                                        {/*<h3>{hostRating.rating_details.length} reviews</h3>*/}
                                    </div>
                                ) :
                                null
                            }
                            <div className="confirmed-body">
                                <div style={{marginBottom: "10px"}}>
                                    <b>{curUser!==undefined?curUser.first_name:null} has confirmed</b>
                                </div>
                                <div style={{marginBottom: "10px"}}>
                                    <img alt="cancel bike" src={require("../images/face-detection.png")} height="20vh" width="20vh" /> Identity
                                </div>
                                <div style={{marginBottom: "40px"}}>
                                <img alt="cancel bike" src={require("../images/mail.png")} height="20vh" width="20vh" /> Email Address
                                </div>
                            </div>

                        </Card.Body>
                    </Card>
                </Col>

                <Col sm={6}>
                    {(hostRating.hasOwnProperty("hasError") && (hostRating.hasError === 1))
                        ?
                        <div>
                            <h2 style={{marginTop:"25px", textAlign:"center", fontSize:"20px",display:"block"}}>This user has no ratings yet!</h2>
                            <img alt="cancel bike" src={require("../images/wheels.png")} height="100vh" width="100vh" className="wheel-img"/>
                        </div>
                        :
                        null
                    }
                    {(hostRating.hasOwnProperty("hasError") && !hostRating.hasError && hostRating.scores.length !== 0
                    && reviewerNames.hasOwnProperty("hasError") && !reviewerNames.hasError) ?
                        (
                            <div className="profile-ratings">
                                <ProfileRatings ratingsList={hostRating.rating_details} userName={curUser!==undefined?curUser:null} scores={hostRating.scores} reviewerNames={reviewerNames.reviewers}/>
                            </div>
                        )
                        :
                        null
                    }
                </Col>
            </Row>

            <Row>

                <div className="dashboard-bike-title">
                    <h1>Bikes by {props.userInfo.user!==undefined?props.userInfo.user.first_name:null}</h1>
                    <div style={{ height: '500px', overflowY: 'scroll' }}>
                        <div>{(bikes.hasOwnProperty("hasError") && !bikes.hasError) ?
                            (<BikeCards bikes={bikes.data}/>):"No bikes from this user yet!"
                        }
                        </div>
                    </div>
                </div>

            </Row>


        </Container>
    );


};

export default Profile;