// Home.js

import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { usePosition } from 'use-position';

import BrowseGrid from '../components/BrowseGrid';
import Footer from '../components/Footer';
import DismissibleAlert from '../components/DismissibleAlert';
import './Home.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBicycle } from '@fortawesome/free-solid-svg-icons';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';


const Home = (props) => {
  console.log(props);
  const [search, setSearch] = useState("");  // store the search results
  const [category, setCategory] = useState("");
  const { push } = useHistory();  // for redirecting after getting form data
  const { latitude, longitude, error} = usePosition();  // for searching with current location
  const noBikes = (props.location.state && props.location.state.noBikes)? true : false; // gets set if user is redirected back home for no search results

  // On submit redirect to listings with search entry from form
  const handleSubmit = (event) => {
    event.preventDefault();
    push({
      pathname: './listings',
      state: {
        search: search,
        category: category,
        latitude: latitude,
        longitude: longitude
      }
    })
  }

  return (
    <div>
      {/* Displays message if user is sent back due to no search results */}
      {noBikes ?
        <DismissibleAlert 
          title="No Results"
          message="Sorry, there are no bikes that match your search. Please try again."
          type="warning"
          redirectLink="/"
          shouldRedirect={false}
          duration={5000}
          />:null
      }
      <Container-fluid>
        {/* Search box section */}
        <Row className="top-home">
          <Col md={{span: 5, offset: 6}} xs={{span: 6, offset:3}} className="main-text">
            <p>go anywhere</p>
            <p>be anywhere</p>
            <Form onSubmit={handleSubmit} inline>
              <Form.Control className="col-md" type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="where do you want to ride?" name="search" />
              <Button type="submit" className="search-button" variant="dark">
                <FontAwesomeIcon icon={faBicycle} />
              </Button>
            </Form>
          </Col>
        </Row>

        {/* Inforamtion section */}
        <Row>
          <Col>
            <h1 className="info-title">Ride Your Bike With Ease</h1>
          </Col>
        </Row>
        <Row>
          <Col md={{span: 2, offset: 2}}>
            <img className="info-img" alt="hand washing icon" src={require("../images/disinfect_200.png")} />
            <p className="info-text">Thoroughly disinfected bicycles for your protection and convenience</p>
          </Col>
          <Col md={{span: 2, offset: 1}}>
            <img className="info-img" alt="person talking icon" src={require("../images/contact_200.png")} />
            <p className="info-text">No contact pick up - Pick up your bike with peace of mind</p>
          </Col>
          <Col md={{span: 2, offset: 1}}>
            <img className="info-img" alt="no bike sign" src={require("../images/cancel_bike_200.png")} />
            <p className="info-text">Need to cancel? You can cancel your reservation for free up to 24 hours prior</p>
          </Col>
        </Row>
        <hr/>

        {/* Browse by category */}
        <BrowseGrid latitude={latitude} longitude={longitude} error={error}/>

        <Footer/>
      </Container-fluid>
    </div>
  )
};

export default Home;
