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
import { Redirect,Link } from 'react-router-dom';

const UserContract = (props) => {
    console.log(props);
    let userId = props.userInfo.user != undefined? props.userInfo.user.id : 0;
    const [contracts, setContracts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [curContract, setCurContract] = useState({});
    const [userHostId, setUserHostId] = useState(-1);
    const [userCustomerId, setUserCustomerId] = useState(-1);
    const [isAuthenticated, setIsAuthenticated] = useState(true);

    const [endingContract, setEndingContract] = useState({});
    const [confirm, setConfirm] = useState(false);

    const fetchUserAndContract = async() => {
        await fetch('api/auth/user')
        .then(res=> res.json())
        .then((res) => {
            props.passUser({...res});
            setIsAuthenticated(res.isAuthenticated);
            if(res.isAuthenticated){
                userId = res.user.id;
                fetchContract();
            }
        })
    }

    const fetchContract = async () => {
        await fetch('/api/get/contracts?userId=' + userId)
        .then((res) => {return res.json()})
        .then((res) => {
            //console.log(res);
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
        //console.log(e.target.name, e.target.id);
        //console.log(contracts[e.target.id])
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

    // set the contract to end and trigger are you sure modal
    const confirmEndContract = (e) => {
        let thisContract = contracts[e.target.id];

        setEndingContract(thisContract);
        setConfirm(true);
    }

    // triggered if user is sure - updates ending of contract in db
    const endContract = async () => {
        await fetch('/api/update/contract', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(endingContract)
        })
        .then( (res) => { return res.json() })
        .then( (res) => {
            if(res.err == undefined) {
                fetchContract();
            }
        })
        .catch( (err) => {console.log(err) });
    }

    useEffect(()=>{
        fetchUserAndContract();
    },[]);

    return (
        <Container-fluid className="usercontract">
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
            <div style={{marginTop:"100px"}}>
                <Row>
                <Col xs={2}></Col>
                <Col xs={8}>
                    <Row className="contractHeader" style={{display:"flex", justifyContent:"center"}}><h1>Your Contracts</h1></Row>
                    <Row style={{display:"flex", justifyContent:"center",marginTop:"20px"}}>
                        {contracts.length ?
                        <Table striped bordered hover responsive="md">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Customer Name</th>
                                    <th>Host Name</th>
                                    <th>Bike Name</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                    <th>Status</th>
                                    <th></th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {contracts.map((contract, index)=>(
                                    <tr>
                                        <td>{index+1}</td>
                                        <td>{contract.customer_user_name}</td>
                                        <td>{contract.host_user_name}</td>
                                        <td>{contract.bikeName}</td>
                                        <td>{formatDate(contract.start_datetime)}</td>
                                        <td>{contract.end_datetime ? formatDate(contract.end_datetime) : "          "}</td>
                                        <td>{contract.status}</td>
                                        {contract.end_datetime ?
                                            <td><Button size="sm" variant="danger" name="confirmEndContract" key={index} id={index} disabled={true}>End Contract</Button></td>
                                        :
                                            <td><Button size="sm" variant="danger" name="confirmEndContract" key={index} id={index} onClick={confirmEndContract}>End Contract</Button></td>
                                        }
                                        <td><Button size="sm" variant="info" name="leaveFeedback" key={index} id={index} onClick={openFeedbackModal}>Leave Feedback</Button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        :<div style={{display:"inline"}}>
                            <span>Haven't Tried Your First Ride? </span> 
                            <Link to='/advancedSearch'><Button variant="danger" style={{marginLeft:"10px",marginRight:"10px"}}>Book Your First Ride</Button></Link>
                            <Link to='/dashboard'><Button variant="danger">Return to Dashboard</Button></Link>
                        </div>
                        }
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
            <ConfirmModal
                contract={endingContract}
                show={confirm}
                close={()=>{setConfirm(false)}}
                endContract={endContract}
            />
        </Container-fluid>
    );
}

/* Takes in a date and formats it to get out yyyy-mm-dd */
const formatDate = (date) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    let d = new Date(date),
        month = '' + (d.getMonth()),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month == '0')
        month = 0;
    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return months[month] + ' ' + day + ', ' + year;
    //return [year, month, day].join('-');
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

function ConfirmModal(props) {
    const handleEndContract = () => {
        props.close();
        props.endContract();
    }

    return (
        <div>
            <Modal
                show={props.show}
                onHide={props.close}
                backdrop="static"
                keyboard={false}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Are You Sure?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p><strong>Bike:</strong> <span className="border">{props.contract.bikeName}</span></p>
                    <p><strong>Host:</strong> <span className="border">{props.contract.host_user_name}</span></p>
                    <p><strong>From:</strong> <span className="border">{props.contract.start_datetime}</span></p>
                    <p><strong>To:</strong> <span className="border">{props.contract.expiration_datetime}</span></p>
                    <p>Are you sure you want to end this contract?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.close}>Back</Button>
                    <Button variant="danger" onClick={handleEndContract}>End Contract</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default UserContract;