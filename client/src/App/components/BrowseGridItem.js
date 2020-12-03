// BrowseGridItem.js

import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import '../pages/Home.css';

const BrowseGridItem = (props) => {

    const { push } = useHistory();
    const [locationError, setLocationError] = useState(false);

    /*
    ** This is triggered when the user clicks to browse by category. If there is an error with
    ** getting their location, it blocks the redirect and alerts the user to check their settings.
    */
    const checkLocation = (event) => {
        if (props.error){
            event.preventDefault();
            setLocationError(true);
            //alert("There is a problem getting your location. Please check your browser settings and try again.");
        }
    }    

    const useLoc = (loc) => {

        push({
            pathname: './listings',
            state: {
                search: props.search,
                category: props.category,
                latitude: null,
                longitude: null,
                catSearch: loc
            }
        });
    }

	return (
        <div>
    		<Link onClick={checkLocation} to={{
                pathname: "./listings",
                state: {
                	search: props.search,
                	category: props.category,
                    latitude: props.latitude,
                    longitude: props.longitude,
                }
            }}>
                <img className="browse-img" alt={props.text} src={require("../images/" + props.file)} />
                <p className="browse-text">{props.text}</p>
            </Link>
            <ErrorModal 
                show={locationError}
                close={()=>{setLocationError(false)}}
                submit={useLoc}
            />
        </div>
	)
};

function ErrorModal(props) {

    const [loc, setLoc] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        props.submit(loc);
        props.close();
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
                    <Modal.Title>Location Error</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>There is a proplem getting your location.</p>
                    <p>Please check your browser settings or enter a location to continue.</p>
                    <input style={{borderRadius: 5+'px', padding: 5+'px'}} type="text" name="searchLoc" placeholder="Enter Location" value={loc} onChange={(e)=>setLoc(e.target.value)} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="light" onClick={props.close}>Back</Button>
                    <Button variant="secondary" onClick={ (e)=> {handleSubmit(e)}}>Use Search</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default BrowseGridItem;