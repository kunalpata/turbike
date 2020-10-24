// BrowseGridItem.js

import React from 'react';
import { Link } from 'react-router-dom';
import '../pages/Home.css';

const BrowseGridItem = (props) => {

	return (
		<Link to={{
            pathname: "./listings",
            state: {search: props.search}
        }}>
            <img className="browse-img" alt={props.text} src={require("../images/" + props.file)} />
            <p className="browse-text">{props.text}</p>
        </Link>
	)
};

export default BrowseGridItem;