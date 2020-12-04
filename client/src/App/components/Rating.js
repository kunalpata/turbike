import React, { useState, useEffect, useRef } from "react";
import { Link, Redirect } from 'react-router-dom';
import './Rating.css';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card'


const Rating = (props) => {
    //props contain rating details: {host:{id:,name:},customer:{id:,name:},bike:{id:,name:},contract_id:,user_id:}
    //console.log("rating");
    //console.log(props);
    //set person to either host or customer
    const person = props.host != undefined ? props.host : props.customer;

    const [ratings, setRatings] = useState({host:0,customer:0,bike:0});
    const [comments, setComments] = useState({host:"",customer:"",bike:""});
    const [bikeRating, setBikeRating] = useState(0);
    const [personRating, setPersonRating] = useState(0);
    const [ratingIds, setRatingIds] = useState({host:-1,customer:-1,bike:-1});
    const [toggleUpdateModes, setToggleUpdateModes] = useState([0,0]); //1 means update and index 0 is person, index 1 is bike
    const submitBtnRefs = useRef([]);
    const textAreaRefs = useRef([]);

    const [isAuthenticated, setIsAuthenticated] = useState(true);

    const getPersonRating = (receivedRating) => {
        let oldRating = {host:receivedRating, customer:receivedRating, bike:ratings.bike};
        setRatings(oldRating);
    }

    const getBikeRating = (receivedRating) => {
        let oldRating = {host:ratings.host, customer:ratings.customer, bike:receivedRating};
        setRatings(oldRating);
    }


    const textChangeHandler = (e) => {
        if(e.target.name === "personDetails"){
            setComments({host:e.target.value,customer:e.target.value,bike:comments.bike});
        }else{
            setComments({host:comments.host,customer:comments.customer,bike:e.target.value});
        }
    }

    const submitFeedback = async (e) => {
        let thisBtn = submitBtnRefs.current[e.target.id];
        thisBtn.disabled = true;
        //console.log(toggleUpdateModes)
        //build the review object for sending
        let requestURL = '/api/add/rating';
        let reviewObj = {
            rated_by_id:props.user_id,
            contract_id:props.contract_id,
        }
        let reviewType = e.target.name;
        if(reviewType === "personFeedback"){
            reviewType = props.host !== undefined ? "host" : "customer";
        }else{
            reviewType = "bike";
        }
        if(toggleUpdateModes[e.target.id] == 1){
            requestURL = '/api/update/rating';
            reviewObj.ratingId = ratingIds[reviewType];
        }
        reviewObj.rating_score = ratings[reviewType];
        reviewObj.rating_details = comments[reviewType];
        reviewObj[reviewType+"_id"] = props[reviewType].id;
        
        //console.log(reviewObj);

        //post to backend
        thisBtn.textContent = "Submitting..."
        await fetch(requestURL,{
            method: 'POST',
            headers: { 'Content-Type' : 'application/json'},
            body: JSON.stringify(reviewObj)
        })
        .then((res) => {
            return res.json();
        })
        .then((res) => {
            //console.log(res);
            if(res.isAuthenticated == false){
                props.passUser({...res});
            }
            else if(res.err === undefined){
                thisBtn.textContent = "Feedback Received!";
            }else{
                thisBtn.textContent = "Server Error! Retry?";
                thisBtn.disabled = false;
            }
        })
        .catch((err) => {
            //console.log(err);
            thisBtn.textContent = "Unknown error! Retry?";
            thisBtn.disabled = false;
        })
        
    }

    const checkFeedbackExist = async () => {
        //console.log("check feedback exist");
        await fetch('/api/get/rating',{
            method: 'POST',
            headers: { 'Content-Type' : 'application/json'},
            body: JSON.stringify(props)
        })
        .then((res) => {return res.json()})
        .then((res) => {
            //console.log(res);
            let updateModes = [...toggleUpdateModes];
            let newRatingIds = {...ratingIds};
            let newComments = {...comments};
            //reload bike old feedback
            if(res.bike != undefined){
                setBikeRating(res.bike.rating_score);
                textAreaRefs.current[1].value = res.bike.rating_details;
                newComments.bike = res.bike.rating_details;
                submitBtnRefs.current[1].textContent = "Update Feedback";
                newRatingIds.bike = res.bike.id;
                updateModes[1] = 1;
            }

            //reload person old feedback
            let personType = res.host != undefined ? "host" : "customer";
            if(res[personType] != undefined){
                setPersonRating(res[personType].rating_score);
                textAreaRefs.current[0].value = res[personType].rating_details;
                newComments[personType] = res[personType].rating_details;
                submitBtnRefs.current[0].textContent = "Update Feedback";
                newRatingIds[personType] = res[personType].id;
                updateModes[0] = 1;
            }else{
                //reset graphical display from previous rating
                setPersonRating(0);
                textAreaRefs.current[0].value = "";
            }

            setRatingIds(newRatingIds);
            setToggleUpdateModes(updateModes);
            setComments(newComments);

        })
        .catch((err) => {console.log(err)});
    }

    const fetchUser = async() => {
        await fetch('/api/auth/user')
        .then(res => res.json())
        .then((res) => {
            //console.log(res);
            props.passUser({...res});
            setIsAuthenticated(res.isAuthenticated);
        })
    }

    useEffect(()=>{
        //check if the feedback exists
        checkFeedbackExist();
    },[person]);

    useEffect(()=>{
        fetchUser();
    },[]);


    return (
        <Container-fluid>
            <Card style={{margin:"5px"}}>
                <Card.Body>
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
                {person != undefined ? 
                <>  
                <h3>Feedback for {person.name}</h3>
                <>
                    <Row>
                        <Col sm={10}>
                            <Row>
                                <Col sm={5} style={{display:"flex", alignItems:"flex-end"}}>
                                    <h6>Overall Satisfaction</h6>
                                </Col>
                                <Col sm={7} style={{display:"flex", alignItems:"center"}}>
                                    <RatingStar selectedRating={personRating} getRating={getPersonRating} />
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={5} style={{display:"flex", alignItems:"center"}}>
                                    <h6>Tell us more about it</h6>
                                </Col>
                                <Col sm={7} style={{display:"flex", alignItems:"center"}}>
                                    <Form.Control as="textarea" style={{resize:"none"}} ref={(el)=>(textAreaRefs.current[0]=el)} rows="2" placeholder="Type Here" name="personDetails" onChange={textChangeHandler} />
                                </Col>
                            </Row>
                        </Col>
                        <Col sm={2} style={{display:"flex", alignItems:"center", justifyContent:"center", padding:"10px"}}>
                            <Button size="sm" variant="danger" id={0} name="personFeedback" ref={(el)=>(submitBtnRefs.current[0] = el)} onClick={submitFeedback}>Submit Feedback</Button>
                        </Col>
                    </Row>                 
                </>
                {props.bike != undefined? 
                    <>
                    <hr/>
                    <h3>Feedback for bike: {props.bike.name}</h3>
                        <Row>
                            <Col sm={10}>
                                <Row>
                                    <Col sm={5} style={{display:"flex", alignItems:"flex-end"}}>
                                        <h6> Overall Satisfaction</h6>
                                    </Col>
                                    <Col sm={7} style={{display:"flex", alignItems:"center"}}>
                                        <RatingStar selectedRating={bikeRating} getRating={getBikeRating} />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm={5} style={{display:"flex", alignItems:"center"}}>
                                        <h6>Tell us more about it</h6>
                                    </Col>
                                    <Col sm={7} style={{display:"flex", alignItems:"center"}}>
                                        <Form.Control as="textarea" style={{resize:"none"}} ref={(el)=>(textAreaRefs.current[1]=el)} rows="2" placeholder="Type Here" name="bikeDetails" onChange={textChangeHandler} />
                                    </Col>
                                </Row>
                            </Col>
                            
                            <Col sm={2} style={{display:"flex", alignItems:"center", justifyContent:"center", padding:"10px"}}>
                                <Button size="sm" variant="danger" id={1} name="bikeFeedback" ref={(el)=>(submitBtnRefs.current[1] = el)} onClick={submitFeedback}>Submit Feedback</Button>
                            </Col>
                        </Row>
                    </>
                :null}
                </>
                :null}
                </Card.Body>
            </Card>
        </Container-fluid>
    );

};

const RatingStar = (props) => {
    //props has a function to pass rating back to rating component

    const starRefs = useRef([]);

    const setRatings = (e) => {
        let numStars = Number(e.target.id) + 1;
        starRefs.current.forEach((star, index) => {
            starRefs.current[index].id < numStars ? starRefs.current[index].style.color = "orange" : starRefs.current[index].style.color = "gray";
        })
        props.getRating(numStars);
    }

    useEffect(() => {
        if(props.selectedRating > 0){
            starRefs.current[props.selectedRating-1].click();
        }else{
            starRefs.current.forEach((star, index) => {
                starRefs.current[index].style.color = "gray";
            });
            props.getRating(0);
        }
    },[props.selectedRating]);

    return (
        <div>
            {[0,0,0,0,0].map((item,index) => (
                <span style={{fontSize:"2em"}} className="star" id={index} key={"star_"+index} ref={(el) => (starRefs.current[index] = el)} onClick={setRatings}>{'★'}</span>
            ))}
        </div>
    );
};


export default Rating;
