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
    console.log(req.body.rentPrice);
    console.log(req.params.id);

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
    let newBike = {
        location_id: 19,
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

// Checks if the rental price is the same so penalty doesn't go null in table
function checkSameRentalPrice(bike_id) {
    let promise = new Promise(((resolve, reject) => {
        pool.query("SELECT price FROM bike WHERE id=?", bike_id, (err, result) => {
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
