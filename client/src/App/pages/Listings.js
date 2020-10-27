// Listings.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MyNavbar from '../components/MyNavbar';
import BikeList from '../components/BikeList';
import './Listings.css';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Listings = (props) => {
  useEffect(() => {
    getBikesByLocation();
  }, []);

  const [bikes, setBikes] = useState({});
  const [location, setLocation] = useState("");

  const getBikesByLocation = async () => {
    const data = await fetch(
      '/api/getBikes'
    );

    const bikes = await data.json();

    setBikes(bikes);
    setLocation(bikes.data[0]["city"]);
    console.log(bikes);
  };

	const searchTerm = props.location.state.search;

  	return (
  		<div className="listing-body">
  			<Container>
          <Row>
            <Col className="info-bar">
              Location: {location}
            </Col>
          </Row>

          <Row>
            <Col md={{span: 5, offset: 0}}>
              {(bikes.hasOwnProperty("hasError") && !bikes.hasError) ? (
                <div>
                  <BikeList bikes={bikes.data}/>
                </div>
              ) : (
                <div>
                  <p>Sorry, no bikes were found matching your search</p>
                </div>
              )}
            </Col>
            
            <Col md={{span: 7, offset: 0}}>
              <img className="map" alt="static map" src={require("../images/map.png")} />
            </Col>
          </Row>
        </Container>
      </div>
  	);
};

export default Listings;