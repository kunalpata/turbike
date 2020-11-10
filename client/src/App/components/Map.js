import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Map, GoogleApiWrapper, InfoWindow, Marker } from 'google-maps-react';
import '../pages/Listings.css';

export class MapContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showingInfoWindow: false,  // Hides or shows the info window
			activeMarker: {},  // Shows the active marker upon click
			selectedPlace: {}  // Shows the InfoWindow to the selected place upon a marker
		};
	}

	// To show the infoWindow as a pop-up window for a clicked marker
	onMarkerClick = (props, marker, e) =>
		this.setState({
			selectedPlace: props,
			activeMarker: marker,
			showingInfoWindow: true
		});

	// To close the infoWindow once a user clicks 'close' on the window
	onClose = (props) => {
		if (this.state.showingInfoWindow) {
			this.setState({
				showingInfoWindow: false,
				activeMarker: null
			});
		}
	};

	render() {
		return (
			<Map
				google={this.props.google}
				zoom={10}
				initialCenter={
					{
						lat: parseFloat(this.props.lat),
						lng: parseFloat(this.props.lng)
					}
				}
			>
				{this.props.bikes.map((bike, index) => (
					<Marker
						key={index}
						onClick={this.onMarkerClick}
						position={{
							lat: bike.latitude,
							lng: bike.longitude
						}}
						name={bike.brand}
					/>
				))}
				<InfoWindow
					marker={this.state.activeMarker}
					visible={this.state.showingInfoWindow}
					onClose={this.onClose}
				>
					<div>
						<p>{this.state.selectedPlace.name}</p>
					</div>
				</InfoWindow>
			</Map>
		);
	}
}

export default GoogleApiWrapper({
	apiKey: process.env.REACT_APP_GOOGLE
})(MapContainer);