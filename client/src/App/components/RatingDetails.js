import React, { useState, useEffect, useRef } from "react";
import { Link, Redirect } from 'react-router-dom';
import './RatingDetails.css';

import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


const RatingDetails = (props) => {
    //props has id, type, name, show-a state variable, close-a function
    const [reviews, setReviews] = useState([]);
    const [loadingMessage, setLoadingMsg] = useState("Loading...");

    const fetchReviews = async(id, type) => {
        setReviews([]);
        setLoadingMsg("Loading...");
        //fetch, type is either bike, host or customer
        await fetch(`/api/get/ratings?id=${id}&type=${type}`)
        .then((res) => {return res.json()})
        .then((res) => {
            //console.log(res);
            setReviews(res);
            if(res.length == 0){
                setLoadingMsg("No review yet!");
            }
        })
        .catch((err) => {console.log(err);setLoadingMsg("Error loading reviews!")});
    };

    useEffect(() => {
        //fetch reviews
        fetchReviews(props.id, props.type);
    },[props]);

    return (
        <Modal
            show={props.show}
            onHide={props.close}
        >
            <Modal.Header closeButton>
                <Modal.Title >Customer Review for {props.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {reviews.length?
                <Table borderless responsive>
                    <col style={{width:"20%"}}/>
                    <col style={{width:"80%"}}/>
                    <thead>
                        <tr>
                            <th style={{textAlign:"center"}}>Rating</th>
                            <th>Comment</th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            reviews.map((review,index) => (
                                <tr>
                                    <td style={{display:"flex",justifyContent:"center"}}>
                                        {[0,0,0,0,0].map((item,index) => (
                                            (index < review.rating_score)?
                                                <span style={{color:"orange",fontSize:"1em"}}>{'★'}</span>
                                                :
                                                <span style={{color:"gray",fontSize:"1em"}}>{'★'}</span>
                                        ))}
                                    </td>
                                    <td colSpan="4" style={{overflow:"hidden"}}>
                                        {review.rating_details}
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
                : <h4>{loadingMessage}</h4>
                }
            </Modal.Body>
            
        </Modal>
    );
}

export default RatingDetails;