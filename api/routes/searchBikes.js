const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();
const pool = require('../dbcon').pool;

//add dotenv functionality
require('dotenv').config();

//get bikes by location search
router.get('/location', (req, res) => {
    // pass user search query to get the coords for it
    getCoords(req.query.loc).then(location => {
        // get the searchs lat/lng from the location return
        const lat = location.lat;
        const lng = location.lng;

        // query by closest match to coordinates of search
        // formula source: https://stackoverflow.com/questions/11112926
        let query = 'SELECT b.id,b.price,b.bike_details,b.bikeName,b.brand,' +
                        'u.user_name,u.email,' +
                        'l.address,l.city,l.state,l.zip,l.latitude,l.longitude,' +
                        'c.name,' +
                        //'r.rating_score,r.rating_details' +
                        ' ( 3959 * acos( cos( radians(l.latitude) ) * cos( radians(?) ) * cos( radians(?) - radians(l.longitude) ) + sin( radians(l.latitude) ) * sin( radians(?) ) ) )' +
                        ' AS distance' +
                    ' FROM bike b inner join user u on b.user_id = u.id' + 
                    ' inner join location l on b.location_id = l.id ' +
                    ' inner join bike_category bc on b.id = bc.bike_id ' +
                    ' inner join category c on bc.category_id = c.id' +
                    //' inner join rating r on b.id = r.bike_id' +
                    //' ORDER BY distance LIMIT 0, 10' +
                    // adding having distance for filtering by distance
                    ' HAVING distance < 50 ORDER BY distance LIMIT 0, 10;'

        //pool.query(query, [loc, loc, loc], (err, result)=>{
        pool.query(query, [lat, lng, lat], (err, result)=>{
            if(err){
                console.log(err);
                res.send({data:[],err:err,hasError:1});
                
            }else{
                let items = [];
                for (let i = 0; i < result.length; i++){
                    let item = {
                        ...result[i],
                    }
                    items.push(item);
                }
                //console.log(items)
                res.send(JSON.stringify({data:items,err:"",hasError:0}));
            }
        });
    });
});


// get bikes by category
router.get('/category', (req, res) => {
    const category = req.query.cat;
    const lat = req.query.lat;
    const lng = req.query.long;

    // get bikes in this category that are the closest to users current location
    let query = 'SELECT b.id,b.price,b.bike_details,b.bikeName,b.brand,' +
                    'u.user_name,u.email,' +
                    'l.address,l.city,l.state,l.zip,l.latitude,l.longitude,' +
                    'c.name' +
                    //'r.rating_score,r.rating_details' +
                    ', ( 3959 * acos( cos( radians(l.latitude) ) * cos( radians(?) ) * cos( radians(?) - radians(l.longitude) ) + sin( radians(l.latitude) ) * sin( radians(?) ) ) )' +
                    ' AS distance' +
                ' FROM bike b inner join user u on b.user_id = u.id' + 
                ' inner join location l on b.location_id = l.id' +
                ' inner join bike_category bc on b.id = bc.bike_id' +
                ' inner join category c on bc.category_id = c.id' +
                //' inner join rating r on b.id = r.bike_id' +
                ' WHERE c.name = ?' +
                //' ORDER BY distance LIMIT 0, 10;'
                // adding having distance for filtering by distance
                ' HAVING distance < 50 ORDER BY distance LIMIT 0, 10;'

    pool.query(query, [lat, lng, lat, category], (err, result)=>{
        if(err){
            console.log(err);
            res.send({data:[],err:err,hasError:1});
            
        }else{
            let items = [];
            for (let i = 0; i < result.length; i++){
                let item = {
                    ...result[i],
                }
                items.push(item);
            }
            //console.log(items)
            res.send(JSON.stringify({data:items,err:"",hasError:0}));
        }
    });
});


// get bike features
router.get('/features', (req, res) => {
    const bike_id = req.query.id;

    // get features for bike with passed in id
    let query = 'SELECT f.name,f.pic_filename' +
                ' FROM feature f inner join bike_feature bf on f.id = bf.feature_id' +
                ' WHERE bf.bike_id = ?;'

    pool.query(query, [bike_id], (err, result)=>{
        if(err){
            console.log(err);
            res.send({data:[],err:err,hasError:1});
            
        }else{
            let items = [];
            for (let i = 0; i < result.length; i++){
                let item = {
                    ...result[i],
                }
                items.push(item);
            }
            //console.log(items)
            res.send(JSON.stringify({data:items,err:"",hasError:0}));
        }
    });
});



/*
** This function takes in the location that was entered in the search bar by
** the user. It calls the google geocode api to get and return the location's 
** lat/lng coordinates.
*/
function getCoords(location){
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
}

module.exports = router;