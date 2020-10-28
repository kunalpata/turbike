// Listings.js

import React, { useState, useEffect } from 'react';
import BikeCards from '../components/BikeCards';
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
  const encodedSearch = encodeURIComponent(props.location.state.search);

  const getBikesByLocation = async () => {
    const url = '/api/getBikes';
    //const url = '/api/getBikes?loc=' + encodedSearch;
    //const url = '/api/search';
    const data = await fetch(url)
    .catch((err)=>{console.log(err)});

    const bikes = await data.json()
    .then((bikes)=>{
      setBikes(bikes);
      setLocation(bikes.data[0]["city"]); // Set location to first item in query results
    })
    .catch((err)=>{console.log(err)});

    //console.log(data);

    //setBikes(bikes);
    //setLocation(bikes.data[0]["city"]); // Set location to first item in query results
    //console.log(bikes);
  };

  	return (
  		<div className="listing-body">
  			<Container>
          <Row>
            <Col className="info-bar">
              Location: {location}
            </Col>
          </Row>

          <Row>

            {/* TODO: Implement map api */}
            <Col md={{span: 7, offset: 0}}>
              <img className="map" alt="static map" src={require("../images/map.png")} />
            </Col>

            <Col md={{span: 5, offset: 0}}>
              {(bikes.hasOwnProperty("hasError") && !bikes.hasError) ? (
                <div>
                  <BikeCards bikes={bikes.data}/>
                </div>
              ) : (
                <div>
                  <p>Sorry, no bikes were found for your search</p>
                </div>
              )}
            </Col>
          </Row>
        </Container>
       
      </div>
  	);
};

export default Listings;