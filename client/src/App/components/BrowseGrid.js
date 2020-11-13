// BrowseGrid.js

import React from 'react';
import BrowseGridItem from './BrowseGridItem';
import '../pages/Home.css';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const BrowseGrid = (props) => {

	return (
		<div>
			<Row>
	          <Col>
	            <h1 className="browse-title">Browse by category</h1>
	          </Col>
	        </Row>
	        <Row>
	          <Col>
	            <BrowseGridItem file="road_bike.jpg" text="Road Bikes" category="Road" search="" />
	          </Col>
	          <Col>
	            <BrowseGridItem file="electric_bike.jpg" text="Electric Bike" category="Electric" search="" />
	          </Col>
	          <Col>
	            <BrowseGridItem file="mountain_bike.jpg" text="Mountain Bike" category="Mountain" search="" />
	          </Col>
	        </Row>
	        <Row>
	          <Col>
	            <BrowseGridItem file="hybrid_bike.jpg" text="Hybrid Bike" category="Hybrid" search="" />
	          </Col>
	          <Col>
	            <BrowseGridItem file="comfort_bike.jpg" text="Comfort Bike" category="Comfort" search="" />
	          </Col>
	          <Col>
	            <BrowseGridItem file="kids_bike.jpg" text="Kids Bike" category="Kids" search=""/>
	          </Col>
	        </Row>
        </div>
	)
};

export default BrowseGrid;