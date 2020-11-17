// searchBikesHelpers.js

let methods = {
	/*
	** Takes in a string that should represent a location. 
	** It calls the google geocode api to get and return the location's 
	** lat/lng coordinates.
	*/
	getCoords: function(location){
		const fetch = require('node-fetch');

	    return new Promise(function(resolve, reject) {
	        // build geocode api uri to get coordinates
	        const url = 'https://maps.googleapis.com/maps/api/geocode/json?' +
	                      'address=' + location + 
	                      '&key=' + process.env.REACT_APP_GOOGLE;
	        fetch(url)
	        .then(res => res.json())
	        .then(json => {

	          // get and return the coordinates from the response
	          resolve(json.results[0].geometry.location)
	        })
	        .catch(err => console.log(err));
	    });
	},


	/*
	** Takes in a bike id, gets all the ratings for the bike and calculates
	** the average rating. Returns 0 if no ratings, otherwise returns the avg.
	*/
	calcBikeAvgRating: function(bike_id, mysql){
	    let promise = new Promise( (resolve, reject) => {
	        // get ratings for this bike
	        let query = 'SELECT rating_score' +
	                    ' FROM rating' +
	                    ' WHERE bike_id = ?;'

	        mysql.query(query, [bike_id], (err, result) => {
	            if(err){
	                console.log(err);
	                resolve(0);
	                
	            } else {
	                let sum = 0;
	                let num_ratings = result.length;

	                if (num_ratings === 0) resolve(0);

	                for (let i = 0; i < num_ratings; i++){
	                    sum += result[i];
	                }
	                
	                return resolve(sum/num_ratings);
	            }
	        });
	    });
	    return promise;
	}
};

module.exports = methods;