// MyCarousel.js

import React from 'react';
import Carousel from 'react-bootstrap/Carousel';

const MyCarousel = (props) => {

	return (
		<div>
		   	<Carousel className="carousel">
   				{props.images.map((img, i) => (
   						<Carousel.Item key={i}>
   							<img
   								className="d-block w-100"
   								src={img.url}
   								height="300px"
   							/>
   						</Carousel.Item>
   					))
   				}
   			</Carousel>
		</div>
	)
};

export default MyCarousel;