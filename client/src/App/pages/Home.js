// Home.js

import React from 'react';
import { Link } from 'react-router-dom';
import MyNavbar from '../components/MyNavbar';
import './Home.css';

//import Navbar from 'react-bootstrap/Navbar';
//import Nav from 'react-bootstrap/Nav';

const Home = (props) => {
  return (
    <div className="home">
      <MyNavbar/>
    </div>
//   <Link to={'./bikeTable'}>
//    <button variant='raised'>Bike Table</button>
//   </Link>
  )
};

export default Home;