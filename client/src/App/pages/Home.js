// Home.js

import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import MyNavbar from '../components/MyNavbar';
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
    <div className="home">
      <MyNavbar/>
      <Container>
        <Row>
          <Col sm={{span: 6, offset: 6}} xs={{span: 6, offset:3}} className="main-text">
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
      </Container>
      <Link to={'./bikeTable'}>
        <button variant='raised'>Bike Table</button>
      </Link>
    </div>
  )
};

export default Home;