// Listings.js

import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import BikeCards from '../components/BikeCards';
import MapContainer from '../components/Map';
import './Listings.css';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Listings = (props) => {
  useEffect(() => {
    if(props.location.state.advancedSearch !== undefined){
      advancedGetBikes();
    }else{
      getBikes();
    }
  },[]);

  const [bikes, setBikes] = useState({});
  const [location, setLocation] = useState("");
  const encodedSearch = encodeURIComponent(props.location.state.search);
  const encodedCategory = encodeURIComponent(props.location.state.category);
  const encodedLatitude = encodeURIComponent(props.location.state.latitude);
  const encodedLongitude = encodeURIComponent(props.location.state.longitude);
  const encodedCatSearch = encodeURIComponent(props.location.state.catSearch);
  const { push } = useHistory();

  /*
  ** Uses search or location information aquired from Home.js to get bikes from
  ** the backend. If bikes are found, they are set in the state. If not, the user
  ** is redirected back to Home.
  */
  const getBikes = async () => {
    // Build the url depending on if user is searching or browsing

    let url = "";
    if (encodedSearch !== ""){
      url = '/api/search/location?loc=' + encodedSearch;
    } else if (encodedCategory !== ""){
      if (encodedLatitude === "null" || encodedLongitude === "null") {
        url = '/api/search/searchCategory?cat=' + encodedCategory +
            '&loc=' + encodedCatSearch;
      } else {
        url = '/api/search/category?cat=' + encodedCategory +
            '&lat=' + encodedLatitude + '&lng=' + encodedLongitude;
      }
    }
    
    // Get and set the bike data
    const data = await fetch(url)
    .catch((err)=>{console.log(err)});

    const bikes = await data.json()
    .then((bikes)=>{
      console.log(bikes);
      // check if no bikes found
      if (bikes.data.length == 0){
        // send back home and dispaly message
        push({
          pathname: './',
          state: {noBikes: true}
        })
      }

      // bikes were found
      setBikes(bikes);
      setRatingLabel(bikes);
      if (bikes.data.length != 0){
        setLocation(bikes.data[0]["city"]); // Set location to first item in query results
      }
    })
    .catch((err)=>{console.log(err)});
  };

  const advancedGetBikes = async() => {
    await fetch('/api/search/advanced',{
			method: 'POST',
			headers: { 'Content-Type' : 'application/json' },
			body: JSON.stringify(props.location.state.advancedSearch)
			
    })
    .then((res) => res.json())
    .then((bikes) => {
      console.log(bikes);
      if(bikes.data.length == 0){
        push({
          pathname: './',
          state: {noBikes: true}
        })
      }
      setBikes(bikes);
      if(bikes.data.length != 0){
        setLocation(bikes.data[0]["city"]);
      }
    })
    .catch((err) => {
      console.log(err);
    })
  }

  
  
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

/* Takes in the bikes, loops over then to set the rating label for each bike */
function setRatingLabel(bikes) {
  bikes.data.map((bike) => {
    let rating = bike.rating;
    
    if (rating === 0) {
      bike.ratingLabel = " not yet rated";
    } else if (rating > 0 && rating < 1) {
      bike.ratingLabel = ' "Bad"';
    } else if (rating >= 1 && rating < 2) {
      bike.ratingLabel = ' "Fair"';
    } else if (rating >= 2 && rating < 3) {
      bike.ratingLabel = ' "Good"';
    } else if (rating >= 3 && rating < 4) {
      bike.ratingLabel = ' "Very Good"';
    } else if (rating >= 4 && rating <= 5) {
      bike.ratingLabel = ' "Excellent"';
    } else {
      bike.ratingLabel = "not yet rated";
    }
  })
}

export default Listings;