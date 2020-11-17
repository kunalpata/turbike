import React, {useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import './AdvancedSearch.css';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import DropDown from '../components/DropDown';
import FeaturesCheckboxes from '../components/FeaturesCheckboxes'


const AdvancedSearch = (props) => {

    const [advancedSearch, setAdvancedSearch] = useState({});
    const {push} = useHistory();

    const handleSubmit = (e) => {
        push({
            pathname: './listings',
            state: {advancedSearch: advancedSearch}
        });
    }

    const textChangeHandler = (e) => {
        console.log(e.target.name, e.target.checked)
    }

    const dropDownSelected = (name, value) => {
        console.log(name, value);
    }

    const updateFeatures = (featureObj) => {
        console.log(featureObj);
    }

    const performSearch = () => {
        console.log("search click!")
    }

    useEffect(() => {

    },[]);


    return(
        <div className="AdvancedSearch">
            <Container style={{marginTop: "100px"}}>
                <Row>
                    <Col></Col>
                    <Col lg={10}>
                        <Card>
                            <Card.Body>
                                <Card.Title style={{display:"flex", flexFlow:"column", justifyContent:"center"}}>
                                    <div style={{width:"100%",fontSize:"40px",textAlign:"center",marginBottom:"10px" }}><strong>Custom Search</strong></div>
                                </Card.Title>
                                <Form>
                                    <Form.Row>
                                        <Form.Group as={Col} lg={8}>
                                            <Form.Label>Enter Search Terms</Form.Label>
                                            <Form.Control type="text" placeholder="keywords" name="searchTerms" onChange={textChangeHandler}/>
                                        </Form.Group>
                                        <Form.Group as={Col} lg={4}>
                                            <Form.Label>Match mode</Form.Label>
                                            <DropDown label="Match mode" name="matchMode" customEntries={[{id:1,name:"Exact Match"},{id:2,name:"Contains"}]} sendSelected={dropDownSelected}/>
                                        </Form.Group>
                                    </Form.Row>
                                    <hr/>
                                    <Form.Row>
                                        <Form.Group as={Col} sm={6}>
                                            <Form.Label>Price Range</Form.Label>
                                            <Form.Group as={Row}>
                                                <Form.Label className="textRight" column sm={4}>From $</Form.Label>
                                                <Col sm={6}>
                                                    <Form.Control type="text" placeholder="" name="lowPrice" onChange={textChangeHandler}/>
                                                </Col>
                                                <Form.Label className="textRight" column sm={4}>To $</Form.Label>
                                                <Col sm={6}>
                                                    <Form.Control type="text" placeholder="" name="highPrice" onChange={textChangeHandler}/>
                                                </Col>
                                            </Form.Group>                                 
                                        </Form.Group>
                                        
                                        <Form.Group as={Col} sm={5}>
                                            <Form.Label>In Category</Form.Label>
                                            <DropDown label="" name="category" sendSelected={dropDownSelected}/>                           
                                        </Form.Group>
                                        <Col sm={1}></Col>
                                    </Form.Row>
                                    <hr/>
                                    <Form.Row>
                                        <Form.Group as={Col} md={4}>
                                            <Form.Label>Has Feature(s)</Form.Label>
                                            <FeaturesCheckboxes getUpdatedFeatures={updateFeatures}/>                              
                                        </Form.Group>
                                        <Form.Group as={Col} md={8}>
                                            <Form.Label>Location</Form.Label>
                                            
                                                <Form.Row>
                                                    <Col xs={4}>
                                                        <Form.Check
                                                            className="textRight"
                                                            type="radio"
                                                            label="Search within: "
                                                            name="radioLocation"
                                                            id="radiusZip"
                                                            onChange={textChangeHandler}
                                                            
                                                        />
                                                    </Col>
                                                    
                                                    <Col xs={8} lg={6}>
                                                        <div style={{display:"flex", flexFlow:"row"}}>
                                                            
                                                            <DropDown size="sm" label="radius" name="searchMile" customEntries={[{id:1,name:"15"},{id:2,name:"25"},{id:3,name:"50"},{id:4,name:"100"}]} sendSelected={dropDownSelected}/>   
                                                            <span style={{marginLeft:"5px", marginRight:"5px", minWidth:"60px"}}>miles of</span>
                                                            <Form.Control size="sm" type="text" placeholder="" name="searchZip" placeholder="Zip" onChange={textChangeHandler}/>
                                                        </div>
                                                    </Col>
                                                    
                                                </Form.Row>
                                                
                                                <Form.Row style={{marginTop:"10px"}}>
                                                    <Col xs={4} className="textMarginLeft">
                                                        <Form.Check
                                                            className="textRight"
                                                            type="radio"
                                                            label="Search this city: "
                                                            name="radioLocation"
                                                            id="city"
                                                            onChange={textChangeHandler}
                                                            
                                                        />
                                                    </Col>
                                                    
                                                    <Col xs={7} lg={6}>
                                                        <DropDown size="sm" label="city" name="city" sendSelected={dropDownSelected}/>                                                       
                                                    </Col>
                                                    
                                                </Form.Row>
     
                                        </Form.Group>
                                    </Form.Row>
                                    <hr/>
                                    <Row style={{display:"flex", justifyContent:"center"}}>
                                        <Button className = "btn-danger" onClick={performSearch} style={{minWidth:"200px"}}>Find bike</Button>	
                                    </Row>	
                                </Form>                               
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col></Col>
                </Row>
            </Container>
        </div>
    )

}

export default AdvancedSearch;
