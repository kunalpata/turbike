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
	            <BrowseGridItem file="road_bike.jpg" text="Road Bikes" search="road" />
	          </Col>
	          <Col>
	            <BrowseGridItem file="electric_bike.jpg" text="Electric Bike" search="electric" />
	          </Col>
	          <Col>
	            <BrowseGridItem file="mountain_bike.jpg" text="Mountain Bike" search="mountain" />
	          </Col>
	        </Row>
	        <Row>
	          <Col>
	            <BrowseGridItem file="hybrid_bike.jpg" text="Hybrid Bike" search="hybrid" />
	          </Col>
	          <Col>
	            <BrowseGridItem file="comfort_bike.jpg" text="Comfort Bike" search="comfort" />
	          </Col>
	          <Col>
	            <BrowseGridItem file="kids_bike.jpg" text="Kids Bike" search="kids" />
	          </Col>
	        </Row>
        </div>
	)
};

export default BrowseGrid;