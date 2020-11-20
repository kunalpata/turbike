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

    const [advancedSearch, setAdvancedSearch] = useState({
        searchTerms:"",
        matchMode:"Contains",
        minPrice:"0",
        maxPrice:"99999999",
        category:"Choose...",
        features:{},
        location:{mode:"any", miles:"any",zip:"any",city:"Choose..."}
    });

    const {push} = useHistory();

    const handleSubmit = (e) => {
        push({
            pathname: './listings',
            state: {advancedSearch: advancedSearch}
        });
    }

    const textChangeHandler = (e) => {
        let curName = e.target.name;
        let curValue = e.target.value;
        console.log(e.target.name, e.target.id)
        let curSearchObj = {...advancedSearch};
        switch(curName){
            case "lowPrice":
                curSearchObj.minPrice = inputTest(/^\d{1,9}\.?\d{0,2}$/,curValue)?curValue:"0";
                curSearchObj.minPrice = (Number(curSearchObj.maxPrice) < Number(curSearchObj.minPrice))?"0":curSearchObj.minPrice;
                break;
            case "highPrice":
                curSearchObj.maxPrice = inputTest(/^\d{1,9}\.?\d{0,2}$/,curValue)?curValue:"99999999";
                curSearchObj.maxPrice = (Number(curSearchObj.minPrice) > Number(curSearchObj.maxPrice))?"99999999":curSearchObj.maxPrice;
                break;
            case "searchZip":
                curSearchObj.location.zip = inputTest(/^\d{5}$/,curValue)?curValue:"any";
                break;
            case "radioLocation":
                switch(e.target.id){
                    case "radiusZip":
                        curSearchObj.location.mode = "radius";
                        break;
                    case "city":
                        curSearchObj.location.mode = "city";
                        break;
                    default:
                        break;
                }
                break;
            default:
                curSearchObj[curName] = curValue;
        }
        console.log(curSearchObj);
        setAdvancedSearch(curSearchObj);
    }

    const dropDownSelected = (name, value) => {
        //console.log(name, value);
        let curSearchObj = {...advancedSearch};
        switch(name){
            case "searchMile":
                curSearchObj.location.miles = value;
                break;
            case "city":
                curSearchObj.location.city = value;
                break;
            default:
                curSearchObj[name]=value;
        }
        console.log(curSearchObj);
        setAdvancedSearch(curSearchObj);
    }

    const updateFeatures = (featureObj) => {
        console.log(featureObj);
        let curSearchObj = {...advancedSearch};
        curSearchObj.features = {...featureObj};
        setAdvancedSearch(curSearchObj);
    }


    function inputTest(regexPattern, targetInput){
        const regex = RegExp(regexPattern);
        return regex.test(targetInput);
    }


    return(
        <div>
            <Container-fluid>
                <Row className="AdvancedSearch">
                    <Col></Col>
                    <Col lg={8} style={{marginTop:"100px", maxWidth:"800px"}}>
                        <Card>
                            <Card.Body>
                                <Card.Title style={{display:"flex", flexFlow:"column", justifyContent:"center"}}>
                                    <div style={{width:"100%",fontSize:"40px",textAlign:"center",marginBottom:"10px" }}><strong>Custom Search</strong></div>
                                </Card.Title>
                                <Form>
                                    <Form.Row>
                                        <Form.Group as={Col} sm={8}>
                                            <Form.Label>Search Terms</Form.Label>
                                            <Form.Control type="text" placeholder="Search Bike name or Brand" name="searchTerms" onChange={textChangeHandler}/>
                                        </Form.Group>
                                        <Form.Group as={Col} sm={4}>
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
                                            <FeaturesCheckboxes extraOptions={true} getUpdatedFeatures={updateFeatures}/>                              
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
                                                            
                                                            <DropDown size="sm" label="radius" name="searchMile" customEntries={[{id:1,name:"5"},{id:2,name:"10"},{id:3,name:"20"},{id:4,name:"50"},{id:5,name:"100"},{id:6,name:"200"}]} sendSelected={dropDownSelected}/>   
                                                            <span style={{marginLeft:"5px", marginRight:"5px", minWidth:"60px"}}>miles of</span>
                                                            <Form.Control size="sm" type="text" name="searchZip" placeholder="Zip" onChange={textChangeHandler}/>
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
                                        <Button className = "btn-danger" onClick={handleSubmit} style={{minWidth:"200px"}}>Find bike</Button>	
                                    </Row>	
                                </Form>                               
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col></Col>
                </Row>
            </Container-fluid>
        </div>
    )

}

export default AdvancedSearch;
