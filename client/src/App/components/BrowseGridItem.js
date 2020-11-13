// BrowseGridItem.js

import React from 'react';
import { Link } from 'react-router-dom';
import '../pages/Home.css';

const BrowseGridItem = (props) => {

    /*
    ** This is triggered when the user clicks to browse by category. If there is an error with
    ** getting their location, it blocks the redirect and alerts the user to check their settings.
    */
    const checkLocation = (event) => {
        if (props.error){
            event.preventDefault();
            alert("There is a problem getting your location. Please check your browser settings and try again.");
        }
    }    

	return (
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
	)
};

export default BrowseGridItem;