const express = require('express');
const router = express.Router();
const pool = require('../dbcon').pool;
const authHelpers = require('../helpers/authenticateHelpers.js');
const fetch = require('node-fetch');

//add dotenv functionality
require('dotenv').config();


router.put('/bike/:id', authHelpers.checkAuthenticated,async (req, res) => {
    console.log(req.body);
    console.log(req.body.category);
    console.log(req.body.bikeFeatures);
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


    // Set the properties to the current fields of the bike obj passed in, ok if some properties are null
    // TODO: Get category and feature ids
    let newBike = {
        location_id: curLocID,
        functional:1,
        price: currentPrice,
        penalty: String(Number(currentPrice) * 0.25),  //25% of rental price penalty
        bike_details: req.body.bikeDesc,
        bikeName: req.body.bikename,
        bikeBrand: req.body.bikeBrand
    };

    pool.query("SELECT * FROM bike WHERE id=?", [req.params.id], async function (err, result) {
        if (err) {
            console.log(err);
        }
        if (result.length == 1) {
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
                    ], async function (err, result) {
                                if (err) {
                                    console.log(err);
                                }else {
                                    console.log(result);
                                    if (req.body.category != undefined) {
                                        let catID = await getCategoryID(req.body.category);
                                        // console.log(catID.catId);
                                        await updateBikeCatTable(req.params.id, catID.catId);
                                    }
                                }
                }
            )
        }
    });


});

function getLocationID(address, bikeID) {
    let promise = new Promise(async (resolve, reject)=>{

        // Get the location id from bike table first
        pool.query("SELECT location_id FROM bike WHERE id=?", [bikeID], async (err, result) => {
            if(err){
                resolve({err:err});
            }else {
                if (result.length == 1) {
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
    // console.log(address);
    // console.log(locID);

    let promise = new Promise(async (resolve, reject)=> {

        pool.query("SELECT * FROM location WHERE id=?", [locID], async (err, result) => {
            if (err) {
                console.log(err);
            }
            if (result.length == 1) {
                let curVals = result[0];
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
                            await getUpdatedLocation(address, locID);
                            console.log(result)
                        }
                    })
            }
        });

    });
}

// Update table with new values
function updateQuery(address, curVals, locID, latLongInfo) {
    let promise = new Promise(async (resolve, reject)=> {
        pool.query('UPDATE location SET address=?, city = ?, state = ?, zip = ?, latitude = ?, longitude = ? WHERE id=?',
            [address.street || curVals.address,
                address.city || curVals.city,
                address.state || curVals.state,
                address.zip || curVals.zip,
                address.latitude || latLongInfo.location.lat,
                address.longitude || latLongInfo.location.lng,
                locID],
             (err, result) => {
                if (err) {
                    // resolve({err:err});
                    console.log(err);
                } else {
                    console.log(result)
                }
            })
    })
}

// Gets most recent location vals
function getUpdatedLocation(address, locID) {

    let promise = new Promise(async (resolve, reject)=> {

        pool.query("SELECT * FROM location WHERE id=?", [locID], async (err, result) => {
            if (err) {
                resolve({err:err});
            }else {
                if (result.length == 1) {
                    let curVals = result[0];
                    let latLongInfo = await getLatLong(curVals);
                    await updateQuery(address, curVals, locID, latLongInfo);
                    resolve(curVals);
                }
            }
        });
    });
    return promise;
}


function getLatLong(address){
    let promise = new Promise(async (resolve, reject) => {
        let addressString = address.address + ', ' + address.city + ', ' + address.state;
        addressString = addressString.replace(/\s/g, '+');
        console.log("\n\n9) " + addressString);
        await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${addressString}&key=${process.env.REACT_APP_GOOGLE}`
        )
            .then((data) => {
                return data.json();
            })
            .then((data) => {
                resolve({location:data.results[0].geometry.location});
            })
            .catch((err) => resolve({err:err}));
    });
    return promise;
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

function getCategoryID(catName){
    let promise = new Promise((resolve, reject) => {
        pool.query('SELECT * FROM category WHERE name=?',[catName], (err, result) => {
            if(err){
                resolve({err:err});
            }else{
                if(result.length == 0){
                    resolve({err:"no such category"});
                }else{
                    resolve({catId:result[0].id});
                }
            }
        });
    });
    return promise;
}

function updateBikeCatTable(bikeID, catID) {
    let promise = new Promise((resolve, reject) => {
        pool.query('UPDATE bike_category SET category_id=? WHERE bike_id=?', [catID, bikeID], (err, result) => {
            if (err) {
                // resolve({err:err});
                console.log(err);
            } else {
                console.log(result)
            }
        })
    })
}

module.exports = router;
