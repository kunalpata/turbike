// UserContract.js

import React, { useEffect, useState } from 'react';
import '../bootstrap/bootstrap.min.css';
import './UserContract.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Rating from '../components/Rating';
import Modal from 'react-bootstrap/Modal';

const UserContract = (props) => {
    console.log(props);
    let userId = props.location.state.userId;

    const [contracts, setContracts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [curContract, setCurContract] = useState({});
    const [userHostId, setUserHostId] = useState(-1);
    const [userCustomerId, setUserCustomerId] = useState(-1);

    const fetchContract = async () => {
        await fetch('/api/get/contracts?userId=' + userId)
        .then((res) => {return res.json()})
        .then((res) => {
            console.log(res);
            if(res.err == undefined){
                setUserHostId(res.curUser_host_id);
                setUserCustomerId(res.curUser_customer_id);
                setContracts(res.results);
            }else{
                alert("Error fetching contracts: " + res.err);
            }
        })
        .catch((err) => {console.log(err)});
    }

    const openFeedbackModal = (e) => {
        console.log(e.target.name, e.target.id);
        console.log(contracts[e.target.id])
        let thisContract = contracts[e.target.id];
        //build current contract obj
        let curContractObj = {contract_id:thisContract.id,user_id:userId};
        if(thisContract.host_id == userHostId){
            curContractObj.customer = {id:thisContract.customer_id, name: thisContract.customer_user_name};
        }else if(thisContract.customer_id == userCustomerId){
            curContractObj.host = {id:thisContract.host_id, name: thisContract.host_user_name};
            curContractObj.bike = {id:thisContract.bike_id, name: thisContract.bikeName};
        }
        
        console.log(curContractObj);
        setCurContract(curContractObj);
        setShowModal(true);
    }

    useEffect(()=>{
        fetchContract();
    },[]);

    return (
        <Container-fluid className="usercontract">
            <div style={{marginTop:"100px"}}>
                <Row>
                <Col xs={2}></Col>
                <Col xs={8}>
                    <Row className="contractHeader" style={{display:"flex", justifyContent:"center"}}><h1>Your Contracts</h1></Row>
                    <Row style={{display:"flex", justifyContent:"center",marginTop:"20px"}}>
                        <Table striped bordered hover responsive="md">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Customer Name</th>
                                    <th>Host Name</th>
                                    <th>Bike Name</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {contracts.length > 0 ? contracts.map((contract, index)=>(
                                    <tr>
                                        <td>{index+1}</td>
                                        <td>{contract.customer_user_name}</td>
                                        <td>{contract.host_user_name}</td>
                                        <td>{contract.bikeName}</td>
                                        <td>{contract.start_datetime}</td>
                                        <td>{contract.end_datetime}</td>
                                        <td><Button size="sm" variant="danger" name="leaveFeedback" key={index} id={index} onClick={openFeedbackModal}>Leave Feedback</Button></td>
                                    </tr>
                                )):null}
                            </tbody>
                        </Table>
                    </Row>
                </Col>
                <Col xs={2}></Col>
                </Row>
            </div>
            <FeedbackModal 
                location={props.location} 
                show={showModal} 
                passUser={props.passUser} 
                contract={curContract} 
                close={()=>{setShowModal(false)}}
            />
        </Container-fluid>
    );
}


function FeedbackModal(props) {

    return (
      <> 
        <Modal
          show={props.show}
          onHide={props.close}
          backdrop="static"
          keyboard={false}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">Leave Feedback</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Rating 
                location={props.location}
                passUser={props.passUser}
                customer={props.contract.customer} 
                host={props.contract.host} 
                bike={props.contract.bike} 
                contract_id={props.contract.contract_id} 
                user_id={props.contract.user_id} 
            />
          </Modal.Body>

        </Modal>
      </>
    );
  }

export default UserContract;