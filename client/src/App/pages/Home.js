// Home.js

import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import MyNavbar from '../components/MyNavbar';
import Footer from '../components/Footer';
import './Home.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBicycle } from '@fortawesome/free-solid-svg-icons';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';


const Home = () => {

  const [search, setSearch] = useState();  // store the search results
  const { push } = useHistory();  // for redirecting after getting form data

  // On submit redirect to listings with search entry from form
  const handleSubmit = (event) => {
    event.preventDefault();
    push({
      pathname: './listings',
      state: {search: search}
    })
  }

  return (
    <div>

      <MyNavbar/>

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
        <Row>
          <Col>
            <h1 className="browse-title">Browse by category</h1>
          </Col>
        </Row>
        <Row>
          <Col>
            <Link to={{
              pathname: "./listings",
              state: {search: "road"}
            }}>
              <img className="browse-img" alt="road bike" src={require("../images/road_bike.jpg")} />
              <p className="browse-text">Road Bikes</p>
            </Link>
          </Col>
          <Col>
            <Link to={{
              pathname: "./listings",
              state: {search: "electric"}
            }}>
              <img className="browse-img" alt="electric bike" src={require("../images/electric_bike.jpg")} />
              <p className="browse-text">Electric Bikes</p>
            </Link>
          </Col>
          <Col>
            <Link to={{
              pathname: "./listings",
              state: {search: "mountain"}
            }}>
              <img className="browse-img" alt="mountain bike" src={require("../images/mountain_bike.jpg")} />
              <p className="browse-text">Mountain Bikes</p>
            </Link>
          </Col>
        </Row>
        <Row>
          <Col>
            <Link to={{
              pathname: "./listings",
              state: {search: "hybrid"}
            }}>
              <img className="browse-img" alt="hybrid bike" src={require("../images/hybrid_bike.jpg")} />
              <p className="browse-text">Hybrid Bikes</p>
            </Link>
          </Col>
          <Col>
            <Link to={{
              pathname: "./listings",
              state: {search: "comfort"}
            }}>
              <img className="browse-img" alt="comfort bike" src={require("../images/comfort_bike.jpg")} />
              <p className="browse-text">Comfort Bikes</p>
            </Link>
          </Col>
          <Col>
            <Link to={{
              pathname: "./listings",
              state: {search: "kids"}
            }}>
              <img className="browse-img" alt="kids bike" src={require("../images/kids_bike.jpg")} />
              <p className="browse-text">Kids Bikes</p>
            </Link>
          </Col>
        </Row>

        <Footer/>
      </Container-fluid>
    </div>
  )
};

export default Home;