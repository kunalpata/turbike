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
import DismissibleAlert from '../components/DismissibleAlert.js';
import CenteredModal from '../components/VerticalCenteredModal.js';
import CustomDropDown from '../components/DropDown.js';
import FeaturesCheckboxes from '../components/FeaturesCheckboxes.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import './BikeAdd.css'

function BikeAdd(props){
    console.log(props)

    const [bikeInfo, setBikeInfo] = useState({});
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [alertInfo, setAlertInfo] = useState({});
    const [disableButton, setDisableButton] = useState(false);
    const [uploadFiles, setUploadFiles] = useState([]);
    const fileRef = useRef(null);
    const imgRef = useRef([]);

    //modal control
    const [modalShow, setModalShow] = useState(false);
    const [modalText, setModalText] = useState("Adding Bike...");


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
            case "filesUpload":
                let userfiles = [];
                //limit files to the first four selected
                let fileLimit = (e.target.files.length > 4? 4: e.target.files.length);
                for(let i = 0; i < fileLimit; i++){
                    let curFile = e.target.files[i];
                    curFile.ranKey = Math.floor(Math.random() * 100000);  //this is to make sure react will rerender the screen for attachment
                    curFile.willUpload = true;
                    curFile.isPrimary = false;
                    userfiles.push(curFile);
                }
                setUploadFiles(userfiles);
                break;
            case "closeImg":
                e.target.parentElement.style.display = "none";
                let curFiles = [...uploadFiles];
                curFiles[e.target.id].willUpload = false;
                setUploadFiles(curFiles);
                break;
            default:
                oldBikeInfo[curInputField] = curInput;
                break;
                
        }
        
        setBikeInfo(oldBikeInfo);

    }
    
    const setFavoritePic = (e) => {

        let picIdx = e.target.id;
        picIdx = picIdx.substr(picIdx.length-1,1);

        let curFiles = [...uploadFiles];
        curFiles[picIdx].isPrimary = !curFiles[picIdx].isPrimary;
        console.log(curFiles);

        imgRef.current.forEach((img,index) => {
            if(img !== null){
                if(picIdx == index && curFiles[index].isPrimary){
                    img.style.color="orange"
                }else{
                    img.style.color = "black";
                    curFiles[index].isPrimary = false;
                }
            }
        })

        setUploadFiles(curFiles);
    }

    const dropDownSelected = (name, value) => {
        let oldBikeInfo = {...bikeInfo};
        oldBikeInfo[name] = value;
        setBikeInfo(oldBikeInfo);
    }

    const updateFeatures = (selectedFeatures) => {
        let oldBikeInfo = {...bikeInfo};
        let newFeatures = {...selectedFeatures};
        oldBikeInfo.bikeFeatures = newFeatures;
        console.log(oldBikeInfo);
        setBikeInfo(oldBikeInfo);
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

    const uploadAttachment = async (listingId) => {
        //update status
        setModalText("Saving images...");
        //create form data
        let formData = new FormData();
        //add listing id to formData
        formData.append('listId', listingId);
        //add files to formData
        let fileCt = 0;
        let primaryFilename = "";
        for(let i = 0; i < uploadFiles.length; i++){
            if(uploadFiles[i].willUpload){
                primaryFilename = uploadFiles[i].isPrimary ? uploadFiles[i].name : "";
                formData.append('aws_multiple_images', uploadFiles[i]);
                fileCt++;
            }
        }
        //add upload file count to formData
        formData.append('newFileCt', fileCt);
        //add primary image information to formData
        formData.append('primaryImg', primaryFilename);


        //fetch backend to upload
        await fetch('/api/aws/upload',{
            method: 'POST',
            body: formData
        })
        .then((res) => {
            return res.json();
        })
        .then((res) => {
            //console.log(res);
            if(res.err === undefined){
                closeModal("Your bike has been added successfully!", true, '/', 5000, res);
            }else{
                console.log(res.err);
                closeModal("Bike added but image upload failed!", true, '/', 5000, res);
            }
        })
        .catch((err) => {
            closeModal("Image upload err: " + err, true, '/', 5000, err);
        });
    }

    const postBike = async () => {
        setDisableButton(true);
        setModalShow(true);     //modal show
        await fetch('/api/add/bike',{
            method: 'POST',
            headers: { 'Content-Type' : 'application/json'},
            body: JSON.stringify({
                ...bikeInfo,
            })
        })
        .then((res) => {return res.json()})
        .then(async (res) => {
            //console.log(res);
            if(res.isAuthenticated == false){
                props.passUser({...res});
                closeModal("You are not logged in! Please login!",true, "/login",2000,res);
            }else if(res.hasOwnProperty('err')){
                setAlertInfo({hasError:true, status:res});
                closeModal("Posting Error! Please try again later!",false, "",5000,res);
            }else{ 
                //upload images
                await uploadAttachment(res.bikeId);
            }
            
        })
    }

    const closeAlert = () => {
        setAlertInfo({hasError:false,isBikeAdded:false,status:{}});
        setDisableButton(false);
    }

    const closeModal = (msg,shouldRedirect, redirectTo, secondToClose, res) => {
        setModalText(msg);

        setTimeout(()=>{
            setModalShow(false);
            if(shouldRedirect){
                if(redirectTo === '/login'){
                    setIsAuthenticated(false);
                }else if(redirectTo === '/'){
                    setAlertInfo({isBikeAdded:true, status:res});
                }          
            }else{
                closeAlert();
            }  
        },secondToClose);
                                                        
    }

    useEffect(() => {
        fetchUser();
    },[])

    return (

		<div>
			<Container-fluid>           
				<Row className="AddNewBike">
                    <Col></Col>
                    <Col lg={8} style={{marginTop: "100px",maxWidth:"800px"}}>
                        <Card>
                            <Card.Body>
                                {!isAuthenticated?<Redirect 
                                                        to={{
                                                            pathname: '/login',
                                                            state: {
                                                                showAlert: true,
                                                                warningText: "You must login to continue!",
                                                                from: props.location
                                                            }
                                                        }}/>:null
                                }
                                {alertInfo.isBikeAdded == true?<Redirect to='/'/> : null}
                    
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
                                            <CustomDropDown label="" name="category" sendSelected={dropDownSelected}/>                                            
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
                                            <CustomDropDown label="" name="state" sendSelected={dropDownSelected}/>

                                        </Form.Group>

                                        <Form.Group as={Col}>
                                            <Form.Control type="text" placeholder="Zip" name="zip" onChange={textChangeHandler} />
                                        </Form.Group>

                                    </Form.Row>

                                    <Form.Row>

                                        <Form.Group as={Col} lg={3}>
                                            <Form.Label>Features</Form.Label>
                                            <FeaturesCheckboxes getUpdatedFeatures={updateFeatures} />
    
                                        </Form.Group>
                                        <Form.Group as={Col} lg={9}>
                                            <Form.Label>Tell us more about it</Form.Label>
                                            <Form.Control as="textarea" rows="5" placeholder="Type Here" name="bikeDesc" onChange={textChangeHandler} />
                                        </Form.Group>

                                    </Form.Row>

                                    <Form.Row>
                                        <Form.Group>
                                            <Form.File id="FormFile1" style={{display:"flex", position:"relative"}}>
                                                
                                                <Form.File.Label style={{color:"blue",textDecoration:"underline blue", cursor:"pointer"}}>Add pictures of your bike (4 max)</Form.File.Label>
                                                <Form.File.Input accept="image/*" style={{opacity:0, position:"absolute", zIndex:-1}} onChange={textChangeHandler} ref={fileRef} onClick={resetFileValue} name="filesUpload" multiple/>
                                                
                                            </Form.File>
                                            <div style={{display:"flex",flexFlow:"row wrap"}}>
                                                {uploadFiles.length > 0 ? 
                                                    uploadFiles.map((file,index) => (
                                                        <div key={"container"+file.ranKey} id={"img"+file.ranKey} style={{display:"flex", position: "relative"}}>
                                                            <img className="img-wrap" key={"img"+file.ranKey} style={{objectFit:"contain",width:"160px",height:"90px",background:"gray",order:1,margin:"5px"}}
                                                            src={URL.createObjectURL(file)}/>
                                                            <div key={file.ranKey} id={index} onClick={textChangeHandler} className="closeImg">x</div>
                                                            <div key={file.ranKey+"_1"} id={index} onClick={setFavoritePic} ref={(el) => (imgRef.current[index] = el)} className="markFavorite" id={"fav-"+index}>{'★'}</div>
                                                            
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
			</Container-fluid>
      			
			<>
                <CenteredModal
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                    warningtext = {modalText}
                />
            </>
		</div>

	);

}


export default BikeAdd