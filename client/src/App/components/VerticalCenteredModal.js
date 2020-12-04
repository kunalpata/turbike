import React, { useState, useEffect } from 'react';
import '../bootstrap/bootstrap.min.css';
import { Redirect } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

function VerticalCenteredModal(props){
    //console.log(props)
    return (
        <Modal 
            {...props}
            aria-labelledby="contained-modal-title-vcenter"
            size="sm"
            backdrop="static"
            keyboard={false}
            centered
            
        >

            <Modal.Body style={{display:"flex",justifyContent:"center",alignItems:"center", flexDirection:"column", minHeight:"150px"}}>
                
                <Spinner style={{width:"150px",height:"150px",margin:"20px", color:"orangered"}}  animation = "border" />
                <p style={{color:"orangered", fontWeight:"bold", textAlign:"center"}}>
                    {props.warningtext}
                </p>
            </Modal.Body>

        </Modal>
    )

}

export default VerticalCenteredModal;