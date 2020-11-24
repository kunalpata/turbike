const express = require('express');
const router = express.Router();
const pool = require('../dbcon').pool;
const authHelpers = require('../helpers/authenticateHelpers.js');
const fetch = require('node-fetch');

//add dotenv functionality
require('dotenv').config();


router.put('/bike/:id', authHelpers.checkAuthenticated,async (req, res) => {
    console.log("RECEIVING NEW BIKE INFO");
    console.log(req.body);
    console.log(req.body.address);
    console.log(req.params.id);

    // For location get its id first, object comes in as addr, city, state, zip, this updates independently
    let curLocID = await getLocationID({
        street: req.body.address,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip,
        lat: 0,  //fetch googlemap for exact lat, long later
        long: 0
    }, req.params.id);



    let currentPrice;
    if (req.body.rentPrice == undefined) {
        currentPrice = await checkSameRentalPrice(req.params.id);
    }else {
        currentPrice = req.body.rentPrice;
    }

    // console.log("CURRENT PRICE");
    // console.log(currentPrice);

    // Set the properties to the current fields of the bike obj passed in, ok if some properties are null
    // TODO: Get category and feature ids
    // TODO: maybe take out location_id?
    let newBike = {
        location_id: curLocID,
        functional:1,
        price: currentPrice,
        penalty: String(Number(currentPrice) * 0.25),  //25% of rental price penalty
        bike_details: req.body.bikeDesc,
        bikeName: req.body.bikename,
        bikeBrand: req.body.bikeBrand
    };

    pool.query("SELECT * FROM bike WHERE id=?", [req.params.id], function (err, result) {
        if (err) {
            console.log(err);
        }
        if (result.length == 1) {
            console.log("CURRENT RESULTS FROM DB")
            console.log(result);
            var curVals = result[0];
            pool.query("UPDATE bike SET location_id=?, functional=?, price=?, penalty=?, bike_details=?, bikeName=?, brand=? WHERE id=?",
                [
                    newBike.location_id || curVals.location_id,
                    newBike.functional || curVals.functional,
                    newBike.price || curVals.price,
                    newBike.penalty || curVals.penalty,
                    newBike.bike_details || curVals.bike_details,
                    newBike.bikeName || curVals.bikeName,
                    newBike.bikeBrand || curVals.brand,
                    req.params.id
                    ], function (err, result) {
                                if (err) {
                                    console.log(err);
                                }else {
                                    console.log(result)
                                }
                }
            )
        }
    });

    console.log("NEW BIKES INFORMATION");
    console.log(newBike);
});

function getLocationID(address, bikeID) {
    let promise = new Promise(async (resolve, reject)=>{

        // Get the location id from bike table first
        pool.query("SELECT location_id FROM bike WHERE id=?", [bikeID], async (err, result) => {
            if(err){
                resolve({err:err});
            }else {
                if (result.length == 1) {
                    console.log("INSIDE LOCATION BIKE QUERY");
                    console.log(result[0].location_id);
                    let locID = result[0].location_id;
                    await updateLocation(address, locID);
                    resolve(locID);
                }
                else {
                    resolve({err:"no field found"});
                }
            }
        })
    });

    return promise;
}

function updateLocation(address, locID) {
    // TODO: Check if any properties are undefined
    console.log("INSIDE UPDATE LOCATION FUNCTION");
    console.log(address);
    console.log(locID);

    let promise = new Promise(async (resolve, reject)=> {

        pool.query("SELECT * FROM location WHERE id=?", [locID], async (err, result) => {
            if (err) {
                console.log(err);
            }
            if (result.length == 1) {
                var curVals = result[0];
                pool.query('UPDATE location SET address=?, city = ?, state = ?, zip = ? WHERE id=?',
                    [address.street || curVals.address,
                        address.city || curVals.city,
                        address.state || curVals.state,
                        address.zip || curVals.zip,
                        locID],
                    async (err, result) => {
                        if(err){
                            // resolve({err:err});
                            console.log(err);
                        }else {
                            console.log(result)
                        }
                    })
            }
        });

    });
}

// Checks if the rental price is the same so penalty doesn't go null in table
function checkSameRentalPrice(bike_id) {
    let promise = new Promise(((resolve, reject) => {
        pool.query("SELECT price FROM bike WHERE id=?", [bike_id], (err, result) => {
            if(err){
                resolve({err:err});
            }else{
                if(result.length == 0){
                    resolve({err:"no field found"});
                }else{
                    // console.log("IN PROMISE");
                    // console.log(result[0].price);
                    resolve(result[0].price)
                }
            }
        })
    }));
    // console.log("PROMISE VALUE");
    // console.log(promise);
    return promise;
}

module.exports = router;
