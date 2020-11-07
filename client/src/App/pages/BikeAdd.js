// BikeAdd.js

import React, { useState } from 'react';
import '../bootstrap/bootstrap.min.css';
import './BikeAdd.css';
import InformSpan from '../components/InformSpan.js';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import {Link, Redirect} from 'react-router-dom';
import Card from "react-bootstrap/Card";

const BikeAdd = (props) => {


    return (
        <Container className="add-form-body">
            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <Card.Title className={"bike-title"}>Add your listing</Card.Title>
                            <Form>
                                <Form.Row>
                                    <Form.Group as={Col} controlId="bBrand">
                                        <Form.Label>Brand</Form.Label>
                                        <Form.Control type="text" />
                                    </Form.Group>
                                    <Form.Group as={Col} controlId="bType">
                                        <Form.Label>***Bike Type</Form.Label>
                                        <Form.Control type="text" />
                                    </Form.Group>
                                </Form.Row>

                                <Form.Row>

                                    <Form.Group as={Col} controlId="bSize">
                                        <Form.Label>Bike Size</Form.Label>
                                        <Form.Control type="text" />
                                    </Form.Group>
                                    <Form.Group as={Col} controlId="bPrice">
                                        <Form.Label>Price</Form.Label>
                                        <Form.Control type="text" />
                                    </Form.Group>
                                </Form.Row>

                                <Form.Row>
                                    <Form.Group as={Col} controlId="bCity">
                                        <Form.Label>City</Form.Label>
                                        <Form.Control type="text" />
                                    </Form.Group>
                                    <Form.Group as={Col} controlId="bState">
                                        <Form.Label>***State</Form.Label>
                                        <Form.Control type="text" />
                                    </Form.Group>
                                </Form.Row>

                                <Form.Row>
                                    <Form.Group as={Col} controlId="bDetails">
                                        <Form.Label>Bike Details</Form.Label>
                                        <Form.Control as="textarea" rows="5"/>
                                    </Form.Group>
                                    <Form.Group as={Col} controlId="bDetails">
                                        <Form.Label>Features</Form.Label>
                                        <Form.Check type="Checkbox" label="Water Bottle Holder" />
                                        <Form.Check type="Checkbox" label="Pouch Included" />
                                        <Form.Check type="Checkbox" label="Kick Stand" />
                                        <Form.Check type="Checkbox" label="Disk Brakes" />
                                        <Form.Check type="Checkbox" label="Rim Brakes" />
                                        <Form.Check type="Checkbox" label="Geared" />
                                    </Form.Group>
                                </Form.Row>

                                <Form.Row>
                                    <Form.Group as={Col} controlId="bCity">
                                        <Button className="add-img-button">Add images</Button>
                                    </Form.Group>
                                </Form.Row>

                                <Button className="reservation-button" block>
                                    Continue
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

        </Container>
    )

};

export default BikeAdd