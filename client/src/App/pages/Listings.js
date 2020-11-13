// Listings.js

import React, { useState, useEffect } from 'react';
import BikeCards from '../components/BikeCards';
import MapContainer from '../components/Map';
import DismissibleAlert from '../components/DismissibleAlert';
import './Listings.css';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Listings = (props) => {
  useEffect(() => {
    getBikes();
  }, []);

  const [bikes, setBikes] = useState({});
  const [location, setLocation] = useState("");
  const encodedSearch = encodeURIComponent(props.location.state.search);
  const encodedCategory = encodeURIComponent(props.location.state.category);
  const encodedLatitude = encodeURIComponent(props.location.state.latitude);
  const encodedLongitude = encodeURIComponent(props.location.state.longitude);

  const getBikes = async () => {

    // Build the url depending on if user is searching or browsing
    let url = "";
    if (encodedSearch !== ""){
      url = '/api/search/location?loc=' + encodedSearch;
    } else if (encodedCategory !== ""){
      url = '/api/search/category?cat=' + encodedCategory +
            '&lat=' + encodedLatitude + '&lng=' + encodedLongitude;
    }
    
    // Get and set the bike data
    const data = await fetch(url)
    .catch((err)=>{console.log(err)});

    const bikes = await data.json()
    .then((bikes)=>{
      setBikes(bikes);
      if (bikes.data.length != 0){
        setLocation(bikes.data[0]["city"]); // Set location to first item in query results
      }

      if (bikes.data.length == 0){

      }
    })
    .catch((err)=>{console.log(err)});
  };

  	return (
  		<div className="listing-body">
      {(bikes.data && bikes.data.length) == 0 ?
        <DismissibleAlert 
          title="No Results"
          message="Sorry, there are no bikes that match your search. You will be redirected to the Turbike home page to try again."
          type="info"
          redirectLink="/"
          shouldRedirect={true}
          duration={5000}
          parentCleanup={()=>{}}
          />:null
      }
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