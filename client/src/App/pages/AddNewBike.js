import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from "react-bootstrap/Card";
import {Link} from "react-router-dom";
import InformSpan from '../components/InformSpan.js';
import './AddNewBike.css'

function AddNewBike(props){

    //fix array for states
    const states = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA",
                    "MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN",
                    "TX","UT","VT","VA","WA","WV","WI","WY"];

    const [categories, setCategories] = useState([]);
    const [features, setFeatures] = useState([]);
    const [bikeInfo, setBikeInfo] = useState({});

    const textChangeHandler = (e) => {
		let curInput = e.target.value;
        let curInputField = e.target.name;
        
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
            default:
                oldBikeInfo[curInputField] = curInput;
                break;
                
        }
        
        setBikeInfo(oldBikeInfo);
        console.log(e.target.value);
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

    const postBike = async () => {
        await fetch('/api/add/bike',{
            method: 'POST',
            headers: { 'Content-Type' : 'application/json'},
            body: JSON.stringify({
                ...bikeInfo,
                user_Id: 7  //placeholder
            })
        })
        .then((res) => {return res.json()})
        .then((res) => {
            console.log(res);
        })
    }


    useEffect(() => {
        fetchCategory();
        fetchFeature();
    },[])

    return (
		<div className="AddNewBike">
			<Container style={{marginTop: "150px"}}>
                <h1 style={{textAlign:"center",margin:"20px"}}>Add a Bike</h1>
				<Row>
                    <Col></Col>
                    <Col lg={10}>
                        <Form>
                            <Form.Row>
                                <Form.Group as={Col} lg={9}>
                                
                                    <Form.Label>Title</Form.Label>
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
                                                
                        </Form>	
                        <Row style={{display:"flex", justifyContent:"center"}}>
                            <Button className = "btn-danger" onClick={postBike} disabled={false} style={{minWidth:"200px"}}>Add Bike</Button>	
                        </Row>	
                    </Col>
                    <Col></Col>
                    			
					
				</Row>
			</Container>
      			
			
		</div>
	);

}

export default AddNewBike;