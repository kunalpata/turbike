// EditBike.js

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
import CenteredModal from '../components/VerticalCenteredModal.js';
import CustomDropDown from '../components/DropDown.js';
import FeaturesCheckboxes from '../components/FeaturesCheckboxes.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import './BikeAdd.css'

function EditBike(props){
    // TODO: Remove
    //console.log("BIKE TO EDIT");
    //console.log(props);
    const bike = props.location.state.bike;
    //console.log(bike);

    const [bikeInfo, setBikeInfo] = useState({});
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [alertInfo, setAlertInfo] = useState({});
    const [disableButton, setDisableButton] = useState(false);
    const [uploadFiles, setUploadFiles] = useState([]);
    const [totalFileCt, setTotalFileCt] = useState(0);   //this is the number of files for this bike listing [old + new]
    const fileRef = useRef(null);
    const imgRef = useRef([]);

    //modal control
    const [modalShow, setModalShow] = useState(false);
    const [modalText, setModalText] = useState("Adding Bike...");


    const resetFileValue = (e) => {
        fileRef.current.value = "";
    }

    // This is getting the change in the input fields and setting those fields to the state obj through event value
    const textChangeHandler = (e) => {

        let curInput = e.target.value;
        let curInputField = e.target.name;
        if(curInputField === undefined){
            curInputField = e.target.className;
        }
        // console.log("HERE");
        // console.log(curInputField)

        let oldBikeInfo = {...bikeInfo};
        switch(curInputField){
            case "filesUpload":
                let userfiles = [...uploadFiles];
                let currentFileCt = checkImagesTotal(userfiles);
                //console.log(currentFileCt);
                //limit files to the first four selected
                let fileLimit = (e.target.files.length > (4-currentFileCt)? (4-currentFileCt): e.target.files.length);
                for(let i = 0; i < fileLimit; i++){
                    let curFile = e.target.files[i];
                    curFile.ranKey = Math.floor(Math.random() * 100000);  //this is to make sure react will rerender the screen for attachment
                    curFile.willUpload = true;
                    curFile.isPrimary = false;
                    curFile.isOld=false;
                    curFile.remove=false;
                    userfiles.push(curFile);
                }
                //console.log(userfiles);
                setUploadFiles(userfiles);
                checkImagesTotal(userfiles);
                break;
            case "closeImg":
                e.target.parentElement.style.display = "none";
                let curFiles = [...uploadFiles];
                curFiles[e.target.id].willUpload = false;
                curFiles[e.target.id].remove = true;
                //console.log(curFiles);
                
                setUploadFiles(curFiles);
                checkImagesTotal(curFiles);
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

        imgRef.current.forEach((img,index) => {
            if(img !== null){
                if(picIdx == index && curFiles[index].isPrimary){
                    img.style.color="orange"
                }else{
                    //console.log(index);
                    img.style.color = "black";
                    curFiles[index].isPrimary = false;
                }
            }else{
                curFiles[index].isPrimary = false;
            }
        })
        //console.log(curFiles);
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
        //console.log(oldBikeInfo);
        setBikeInfo(oldBikeInfo);
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

    const updateAttachment = async (listingId) => {
        //update status
        setModalText("Updating images...");
        //create form data
        let formData = new FormData();
        //add listing id to formData
        formData.append('listId', listingId);
        //add files to formData
        let fileCt = 0;
        let primaryFilename = "";
        let fileToRemove = [];
        let oldFileList = [];
        for(let i = 0; i < uploadFiles.length; i++){
            if(uploadFiles[i].willUpload){
                primaryFilename = uploadFiles[i].isPrimary ? uploadFiles[i].name : "";
                formData.append('aws_multiple_images', uploadFiles[i]);
                fileCt++;
            }else if(uploadFiles[i].remove && uploadFiles[i].isOld){
                fileToRemove.push(uploadFiles[i]);
            }
            if(uploadFiles[i].isOld){
                oldFileList.push(uploadFiles[i]);
            }
        }
        //add upload file count to formData
        formData.append('newFileCt', fileCt);
        //add primary image information to formData
        formData.append('primaryImg', primaryFilename);

        //fetch backend to delete files
        await fetch('/api/aws/delete',{
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({removeList:fileToRemove, oldFileList:oldFileList})
        })
        .then((res) => {return res.json();})
        .then(async (res) => {
            if(res.err == undefined){
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
                            closeModal("Your bike has been updated successfully!", true, '/', 5000, res);
                        }else{
                            //console.log(res.err);
                            closeModal("Bike updated but image upload failed!", true, '/', 5000, res);
                        }
                    })
                    .catch((err) => {
                        closeModal("Image upload err: " + err, true, '/', 5000, err);
                    });
            }else{
                closeModal("Error deleting images: " + res.err, true, '/', 5000, res.err);
            }
        });
        
    }

    const putBike = async () => {
        // TODO: Remove
        //console.log("SENDING NEW BIKE INFO");
        //console.log(bikeInfo);
        setDisableButton(true);
        
        setModalShow(true);     //modal show
        await fetch(`/api/update/bike/${bike.id}`,{
            method: 'PUT',
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
                //update images
                 await updateAttachment(bike.id);
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

    function home(e) {
        e.preventDefault();
        window.location = '/userBikes';
    }

    const checkImagesTotal = (imgArr) => {
        let imageCt = 0;
            for(let i = 0; i < imgArr.length; i++){
                if(!imgArr[i].remove){
                    imageCt++;
                }
            }
            setTotalFileCt(imageCt);
            return imageCt;
    }

    useEffect(() => {
        fetchUser();
        function saveOldPics(){
            if(bike.images){
                let oldImageArr = bike.images.map((image)=>{
                    let curFile = {
                        url:image.url,
                        id:image.id,
                        ranKey:Math.floor(Math.random() * 100000),
                        willUpload:false,
                        isPrimary:image.isPrimary,
                        isOld:true,
                        remove:false
                    }
                    return curFile;
                })
                setUploadFiles(oldImageArr);
                checkImagesTotal(oldImageArr);           
            }
        }
        saveOldPics();
        //save address info
        setBikeInfo({...bikeInfo,address:bike.address,city:bike.city,state:bike.state,zip:bike.zip,category:bike.name});
    },[])

    return (

        <div>
            <Container-fluid>
                <Row className="AddNewBike">
                    <Col></Col>
                    <Col lg={8} style={{marginTop: "100px",maxWidth:"800px"}}>
                        <Card id="mobile-settings">
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
                                {alertInfo.isBikeAdded == true?<Redirect to='/'/> : null}

                                <Card.Title style={{display:"flex", flexFlow:"column", justifyContent:"center"}}>
                                    <div style={{width:"100%",fontSize:"40px",textAlign:"center",marginBottom:"5px" }}><strong>Edit bike</strong></div>
                                </Card.Title>
                                <Form>
                                    <Form.Row>
                                        <Form.Group as={Col} lg={9}>

                                            <Form.Label>Bike name</Form.Label>
                                            <Form.Control  type="text" defaultValue={bike.bikeName} name="bikename" onChange={textChangeHandler} />
                                        </Form.Group>
                                        <Form.Group as={Col} lg={3}>
                                            <Form.Label>Rent Per Day</Form.Label>
                                            <Form.Control  type="text" defaultValue={bike.price} name="rentPrice" onChange={textChangeHandler} />

                                        </Form.Group>

                                    </Form.Row>

                                    <Form.Row>
                                        <Form.Group as={Col} lg={6}>
                                            <Form.Label>Brand</Form.Label>
                                            <Form.Control type="text" defaultValue={bike.brand} name="bikeBrand" onChange={textChangeHandler} />
                                        </Form.Group>
                                        <Form.Group as={Col} lg={6}>
                                            <Form.Label>Type</Form.Label>
                                            <CustomDropDown label="" name="category" selectedValue={bike.name} sendSelected={dropDownSelected}/>
                                        </Form.Group>
                                    </Form.Row>

                                    <Form.Row>
                                        <Form.Group as={Col} lg={12}>
                                            <Form.Label>Location</Form.Label>
                                            <Form.Control type="text" defaultValue={bike.address} name="address" onChange={textChangeHandler} />
                                        </Form.Group>
                                    </Form.Row>

                                    <Form.Row>
                                        <Form.Group as={Col}>
                                            <Form.Control type="text" defaultValue={bike.city} name="city" onChange={textChangeHandler} />
                                        </Form.Group>

                                        <Form.Group as={Col}>
                                            <CustomDropDown label="" name="state" selectedValue={bike.state} sendSelected={dropDownSelected}/>

                                        </Form.Group>

                                        <Form.Group as={Col}>
                                            <Form.Control type="text" defaultValue={bike.zip} name="zip" onChange={textChangeHandler} />
                                        </Form.Group>

                                    </Form.Row>

                                    <Form.Row>

                                        <Form.Group as={Col} lg={3}>
                                            <Form.Label>Features</Form.Label>
                                            <FeaturesCheckboxes bikeId={bike.id} getUpdatedFeatures={updateFeatures} />

                                        </Form.Group>
                                        <Form.Group as={Col} lg={9}>
                                            <Form.Label>Tell us more about it</Form.Label>
                                            <Form.Control as="textarea" rows="5" defaultValue={bike.bike_details} name="bikeDesc" onChange={textChangeHandler} />
                                        </Form.Group>

                                    </Form.Row>

                                    <Form.Row>
                                        <Form.Group>
                                            <Form.Label>Images</Form.Label>
                                            <div style={{display:"flex",flexFlow:"row wrap"}}>
                                                {uploadFiles.length > 0 ?
                                                    uploadFiles.map((file,index) => 
 
                                                        (<>{!file.remove?
                                                        <div key={"container"+file.ranKey} id={"img"+file.ranKey} style={{display:"flex", position: "relative"}}>
                                                            <img className="img-wrap" key={"img"+file.ranKey} style={{objectFit:"contain",width:"160px",height:"90px",background:"gray",order:1,margin:"5px"}}
                                                                 src={file.isOld?file.url:URL.createObjectURL(file)}/>
                                                            <div key={file.ranKey} id={index} onClick={textChangeHandler} className="closeImg">x</div>
                                                            <div key={file.ranKey+"_1"} id={index} onClick={setFavoritePic} style={{color:(file.isPrimary)?"orange":"black"}} ref={(el) => (imgRef.current[index] = el)} className="markFavorite" id={"fav-"+index}>{'★'}</div>

                                                        </div>
                                                        :null}</>)

                                                    ):null
                                                }
                                            </div>
                                            {totalFileCt < 4?
                                            <Form.File id="FormFile1" style={{display:"flex", position:"relative"}}>

                                                <Form.File.Label style={{color:"blue",textDecoration:"underline blue", cursor:"pointer"}}>Add pictures of your bike (4 max)</Form.File.Label>
                                                <Form.File.Input accept="image/*" style={{opacity:0, position:"absolute", zIndex:-1}} onChange={textChangeHandler} ref={fileRef} onClick={resetFileValue} name="filesUpload" multiple/>

                                            </Form.File>
                                            :<div></div>}

                                        </Form.Group>
                                    </Form.Row>

                                </Form>
                                <Row style={{display:"flex", justifyContent:"center"}}>
                                    <Button className = "btn-danger" onClick={putBike} disabled={disableButton} style={{minWidth:"200px", marginBottom:"10px"}}>Edit Bike</Button>
                                </Row>
                                <Row style={{display:"flex", justifyContent:"center"}}>
                                    <Button className = "btn-secondary" onClick={home} disabled={disableButton} style={{minWidth:"200px"}}>Cancel</Button>
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


export default EditBike;