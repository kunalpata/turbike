// Listings.js

import React, { useState, useEffect } from 'react';
import BikeCards from '../components/BikeCards';
import MapContainer from '../components/Map';
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
    const url = '/api/search?loc=' + encodedSearch;
    
    const data = await fetch(url)
    .catch((err)=>{console.log(err)});

    const bikes = await data.json()
    .then((bikes)=>{
      setBikes(bikes);
      setLocation(bikes.data[0]["city"]); // Set location to first item in query results
    })
    .catch((err)=>{console.log(err)});
  };

  	return (
  		<div className="listing-body">
  			<Container>
          <Row>
            <Col className="info-bar">
              Location: {location}
            </Col>
          </Row>

          <div className="wrap">
            <Col className="left" md={{span: 7, offset: 0}} sm={{span: 12}}>
              {(bikes.data && bikes.data[0]) ? (
                <div>
                  <MapContainer bikes={bikes.data} lat={bikes.data[0]['latitude']} lng={bikes.data[0]['longitude']} />
                </div>
              ) : (
                <div>
                  <p>Map is loading...</p>
                </div>
              )}
            </Col>

            <Col className="right" md={{span: 5, offset: 0}} sm={{span: 12}}>
              {(bikes.hasOwnProperty("hasError") && !bikes.hasError) ? (
                <div>
                  <BikeCards bikes={bikes.data}/>
                </div>
              ) : (
                <div>
                  <p>Bikes are loading...</p>
                </div>
              )}
            </Col>
          </div>
        </Container>
      </div>
  	);
};

export default Listings;