const express = require('express');
const router = express.Router();
const pool = require('../dbcon').pool;

//add dotenv functionality
require('dotenv').config();

//Add new bike, user must login to add bike
router.post('/add/bike', async (req, res) => {
    console.log(req.body); //body should have {user_id:,streetAddress:,city:,state:,zip:,functional:,price:,penalty:,bike_details:}
    let location_id = await getLocationID({ street: req.body.streetAddress,
                                            city: req.body.city,
                                            state: req.body.state,
                                            zip: req.body.zip,
                                            lat: 0,  //fetch googlemap for exact lat, long later
                                            long: 0});
    
    if(location_id['err'] == undefined){
        let newBike = {
            user_id:req.body.user_id,
            location_id: location_id.location_id,
            functional:req.body.functional,
            price: req.body.price,
            penalty: req.body.penalty,
            bike_details: req.body.bike_details
        };    
    
        if(newBike.location_id)
        pool.query('INSERT INTO bike (user_id, location_id, functional, price, penalty, bike_details) VALUES (?,?,?,?,?,?)',
                   [
                       newBike.user_id,
                       newBike.location_id,
                       newBike.functional,
                       newBike.price,
                       newBike.penalty,
                       newBike.bike_details
                   ], (err,result)=>{
                       if(err){
                           res.send({err:err});
                       }else{
                           res.send({status:'Bike added', insertId:result.insertId});
                       }
                   });
        
    }else{
        res.send({err:location_id['err']});
    }
    
});


//helper function
function getLocationID(address){  //address is an object: {street:,city:,state:,zip:,lat:,long:}, lat, long to be implemented later
    let promise = new Promise(async (resolve, reject)=>{
        //query database for location_id
        pool.query('SELECT * FROM location WHERE address=? AND city = ? AND state = ? AND zip = ?',
                    [address.street,address.city,address.state,address.zip], async (err, result)=>{
                        if(err){
                            resolve({err:err});
                        }else{
                            if(result.length == 0){
                                let newLocID = await addNewLocation(address);
                                resolve({location_id: newLocID});
                            }else{
                                resolve({location_id: result[0].location_id});
                            }
                        }
                    })
    });
    return promise;
}

function addNewLocation(address){  //add a new location if address is not in location table and return new location_id
    let promise = new Promise((resolve, reject)=>{
        pool.query('INSERT INTO location (address,city,state,zip,latitude,longitude' + 
            'VALUES (?,?,?,?,?,?'),
            [
                address.street,
                address.city,
                address.state,
                address.zip,
                address.lat,
                address.long
            ], (err,result)=>{
                if(err){
                    resolve({err:err});
                }else{
                    resolve({location_id:result.insertId});
                }
            }
    });
    return promise;
}


module.exports = router;