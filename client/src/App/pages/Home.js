// Home.js

import React from 'react';
import { Link } from 'react-router-dom';
import MyNavbar from '../components/MyNavbar';
import './Home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBicycle } from '@fortawesome/free-solid-svg-icons';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const Home = (props) => {
  return (
    <div className="home">
      <MyNavbar/>
      <Container>
        <Row>
          <Col></Col>
          <Col className="main-text">
            <p>go anywhere</p>
            <p>be anywhere</p>
            <Form inline>
              <Form.Control className="col-md" type="text" placeholder="where do you want to ride?" name="search" />
              <Button className="search-button" variant="dark"><FontAwesomeIcon icon={faBicycle} /></Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
//   <Link to={'./bikeTable'}>
//    <button variant='raised'>Bike Table</button>
//   </Link>
  )
};

export default Home;