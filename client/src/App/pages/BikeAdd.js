// BikeAdd.js

import React, { useState, useEffect, useRef } from 'react';
import { Redirect } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from "react-bootstrap/Card";
import {Link} from "react-router-dom";
import InformSpan from '../components/InformSpan.js';
import DismissibleAlert from '../components/DismissibleAlert.js'
import './BikeAdd.css'

function BikeAdd(props){
    console.log(props)
    //fix array for states
    const states = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA",
                    "MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN",
                    "TX","UT","VT","VA","WA","WV","WI","WY"];

    const [categories, setCategories] = useState([]);
    const [features, setFeatures] = useState([]);
    const [bikeInfo, setBikeInfo] = useState({});
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [alertInfo, setAlertInfo] = useState({});
    const [disableButton, setDisableButton] = useState(false);
    const [uploadFiles, setUploadFiles] = useState([]);
    const fileRef = useRef(null);

    const resetFileValue = (e) => {
        fileRef.current.value = "";
    }

    const textChangeHandler = (e) => {
		let curInput = e.target.value;
        let curInputField = e.target.name;
        if(curInputField === undefined){
            curInputField = e.target.className;
        }

        let oldBikeInfo = {...bikeInfo};
        switch(curInputField){
            case "features":
                if(!oldBikeInfo.hasOwnProperty("bikeFeatures")){
                    oldBikeInfo.bikeFeatures = {};
                }
                let newFeatures = {...oldBikeInfo.bikeFeatures};
                newFeatures[e.target.id] = e.target.checked?true:false;
                oldBikeInfo.bikeFeatures = {...newFeatures};
                break;
            case "filesUpload":
                let userfiles = [];
                //limit files to the first four selected
                let fileLimit = (e.target.files.length > 4? 4: e.target.files.length);
                for(let i = 0; i < fileLimit; i++){
                    e.target.files[i].ranKey = Math.floor(Math.random() * 100000);  //this is to make sure react will rerender the screen for attachment
                    e.target.files[i].willUpload = true;
                    userfiles.push(e.target.files[i]);
                }
                setUploadFiles(userfiles);
                break;
            case "closeImg":
                e.target.parentElement.style.display = "none";
                let curFiles = [...uploadFiles];
                curFiles[e.target.id].willUpload = false;
                setUploadFiles(curFiles);
                console.log(curFiles);
                break;
            default:
                oldBikeInfo[curInputField] = curInput;
                break;
                
        }
        
        setBikeInfo(oldBikeInfo);

	}

    const fetchCategory = async () => {
        await fetch('/api/get/categories')
		.then((res) => {return res.json()})
		.then((res) => {console.log(res); setCategories(res.data)})
		.catch((err) => {console.log(err)});

    }

    const fetchFeature = async () => {
        await fetch('/api/get/features')
		.then((res) => {return res.json()})
		.then((res) => {console.log(res); setFeatures(res.data)})
		.catch((err) => {console.log(err)});

    }

    const fetchUser = async() => {
        await fetch('/api/auth/user')
        .then(res => res.json())
        .then((res) => {
            console.log(res);
            props.passUser({...res});
            setIsAuthenticated(res.isAuthenticated);
        })
    }

    const postBike = async () => {
        setDisableButton(true);
        await fetch('/api/add/bike',{
            method: 'POST',
            headers: { 'Content-Type' : 'application/json'},
            body: JSON.stringify({
                ...bikeInfo,
            })
        })
        .then((res) => {return res.json()})
        .then((res) => {
            console.log(res);
            if(res.isAuthenticated == false){
                setIsAuthenticated(false);
            }else if(res.hasOwnProperty('err')){
                setAlertInfo({hasError:true, status:res});
            }else{
                setAlertInfo({isBikeAdded:true, status:res});
            }
            
        })
    }

    const closeAlert = () => {
        setAlertInfo({hasError:false,isBikeAdded:false,status:{}});
        setDisableButton(false);
    }

    useEffect(() => {
        fetchUser();
        fetchCategory();
        fetchFeature();
    },[])

    return (
		<div className="AddNewBike">

			<Container style={{marginTop: "100px"}}>
            
				<Row>
                    <Col></Col>
                    <Col lg={10}>
                        <Card>
                            <Card.Body>
                                {!isAuthenticated?<Redirect 
                                                        to={{
                                                            pathname: '/login',
                                                            state: {
                                                                showAlert: true,
                                                                warningText: "You must login to continue!"
                                                            }
                                                        }}/>:null
                                }
                                {alertInfo.isBikeAdded == true?<DismissibleAlert
                                                                    title={alertInfo.status.status}
                                                                    message="Bike added successfully!"
                                                                    type = "info"
                                                                    redirectLink="/"
                                                                    shouldRedirect={true}
                                                                    duration={5000}
                                                                    parentCleanup={()=>{}}
                                                            />: null

                                }
                                {alertInfo.hasError == true?<DismissibleAlert
                                                                    title="Adding bike error"
                                                                    message="Server Error while adding bike, please try again later!"
                                                                    type = "danger"
                                                                    redirectLink="/"
                                                                    shouldRedirect={false}
                                                                    duration={3000}
                                                                    parentCleanup={closeAlert}
                                                            />: null

                                }
                    
                                <Card.Title style={{display:"flex", flexFlow:"column", justifyContent:"center"}}>
                                    <div style={{width:"100%",fontSize:"40px",textAlign:"center",marginBottom:"5px" }}><strong>Add a bike</strong></div>
                                </Card.Title>
                                <Form>
                                    <Form.Row>
                                        <Form.Group as={Col} lg={9}>
                                        
                                            <Form.Label>Bike name</Form.Label>
                                            <Form.Control  type="text" placeholder="Bike Name" name="bikename" onChange={textChangeHandler} />
                                        </Form.Group>
                                        <Form.Group as={Col} lg={3}>    
                                            <Form.Label>Rent Per Day</Form.Label>
                                            <Form.Control  type="text" placeholder="Rental Price" name="rentPrice" onChange={textChangeHandler} />
                                    
                                        </Form.Group>

                                    </Form.Row>

                                    <Form.Row>
                                        <Form.Group as={Col} lg={6}>
                                            <Form.Label>Brand</Form.Label>
                                            <Form.Control type="text" placeholder="Brand" name="bikeBrand" onChange={textChangeHandler} />
                                        </Form.Group>
                                        <Form.Group as={Col} lg={6}>
                                            <Form.Label>Type</Form.Label>
                                            <Form.Control as="select" name="category" defaultValue="Choose..." onChange={textChangeHandler}>
                                                <option>Choose...</option>
                                                {categories.map((category) =>
                                                    (<option key={category.id}>{category.name}</option>)
                                                )}
                                            </Form.Control>
                                        </Form.Group>
                                    </Form.Row>

                                    <Form.Row>
                                        <Form.Group as={Col} lg={12}>
                                            <Form.Label>Location</Form.Label>
                                            <Form.Control type="text" placeholder="Address" name="address" onChange={textChangeHandler} />
                                        </Form.Group>
                                    </Form.Row>

                                    <Form.Row>
                                        <Form.Group as={Col}>
                                            <Form.Control type="text" placeholder="City" name="city" onChange={textChangeHandler} />
                                        </Form.Group>

                                        <Form.Group as={Col}>
                                            <Form.Control as="select" name="state" defaultValue="Choose..." onChange={textChangeHandler}>
                                                <option>State</option>
                                                {states.map((state,index) => 
                                                    (<option key={index}>{state}</option>)
                                                )}
                                            </Form.Control>
                                        </Form.Group>

                                        <Form.Group as={Col}>
                                            <Form.Control type="text" placeholder="Zip" name="zip" onChange={textChangeHandler} />
                                        </Form.Group>

                                    </Form.Row>

                                    <Form.Row>

                                        <Form.Group as={Col} lg={3}>
                                            <Form.Label>Features</Form.Label>
                                            {features.map((feature) => 
                                                (<Form.Check type="checkbox" name="features" id={feature.id} value={feature.name} label={feature.name} key={feature.id} onClick={textChangeHandler} />)
                                            )}
                                        </Form.Group>
                                        <Form.Group as={Col} lg={9}>
                                            <Form.Label>Tell us more about it</Form.Label>
                                            <Form.Control as="textarea" rows="10" placeholder="Type Here" name="bikeDesc" onChange={textChangeHandler} />
                                        </Form.Group>

                                    </Form.Row>

                                    <Form.Row>
                                        <Form.Group>
                                            <Form.File id="exampleFormControlFile1" style={{display:"flex", position:"relative"}}>
                                                <Form.File.Label style={{color:"blue",textDecoration:"underline blue", cursor:"pointer"}}>Add pictures of your bike (4 max)</Form.File.Label>
                                                <Form.File.Input style={{opacity:0, position:"absolute", zIndex:-1}} onChange={textChangeHandler} ref={fileRef} onClick={resetFileValue} name="filesUpload" multiple/>
                                            </Form.File>
                                            <div style={{display:"flex",flexFlow:"row wrap"}}>
                                                {uploadFiles.length > 0 ? 
                                                    uploadFiles.map((file,index) => (
                                                        <div key={"container"+file.ranKey} id={"img"+file.ranKey} style={{display:"flex", position: "relative"}}>
                                                            <img className="img-wrap" key={"img"+file.ranKey} style={{objectFit:"contain",width:"160px",height:"90px",background:"gray",order:1,margin:"5px"}}
                                                            src={URL.createObjectURL(file)}/>
                                                            <div key={file.ranKey} id={index} onClick={textChangeHandler} className="closeImg">x</div>
                                                        </div>
                                                    )):null     
                                                }   
                                            </div>

                                        </Form.Group>
                                    </Form.Row>

                                </Form>	
                                <Row style={{display:"flex", justifyContent:"center"}}>
                                    <Button className = "btn-danger" onClick={postBike} disabled={disableButton} style={{minWidth:"200px"}}>Add Bike</Button>	
                                </Row>	
                            </Card.Body>
                        </Card>
                        
                    </Col>
                    <Col></Col>
                    			
					
				</Row>
			</Container>
      			
			
		</div>
	);

}

export default BikeAdd