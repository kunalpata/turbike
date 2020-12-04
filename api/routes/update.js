const express = require('express');
const router = express.Router();
const pool = require('../dbcon').pool;
const authHelpers = require('../helpers/authenticateHelpers.js');
const addBikeHelpers = require('../helpers/addBikeHelper.js');
const fetch = require('node-fetch');

//add dotenv functionality
require('dotenv').config();

router.post('/contract', authHelpers.checkAuthenticated, async (req, res) => {
    let end_datetime = new Date();

    // figure out contract status
    let end_time = end_datetime.getTime();
    let start_time = new Date(req.body.start_datetime).getTime();
    let expiration_time = new Date(req.body.expiration_datetime).getTime();

    let status = "";
    // check for valid cancelation - before 3 hours prior to start
    if (end_time < (start_time - 10800000)) {
        status = "canceled";
    // check for penalty cancelation
    } else if (end_time < start_time) {
        status = "canceled with penalty"
    // check for valid end
    } else if (end_time <= expiration_time) {
        status = "complete";
    // check for late
    } else if (end_time > expiration_time) {
        status = "late with penalty"
    } else {
        status = "canceled";
    }

    let query = 'UPDATE contract ' +
                'SET id=?,host_id=?,customer_id=?,start_datetime=?,expiration_datetime=?,status=?,bike_id=?,end_datetime=? ' +
                'WHERE id=?;'
    pool.query(query, 
                [
                    req.body.id,
                    req.body.host_id,
                    req.body.customer_id,
                    req.body.start_datetime,
                    req.body.expiration_datetime,
                    status,
                    req.body.bike_id,
                    end_datetime,
                    req.body.id
                ], (err, result) => {
                    if (err) {
                        console.log(err);
                        res.send({err:err});
                    } else {
                        res.send(result);
                    }
                });
})

router.post('/rating', authHelpers.checkAuthenticated, async (req, res) => {
    pool.query('UPDATE rating SET bike_id=?,host_id=?,customer_id=?,rating_score=?,rating_details=?,rated_by_id=?,contract_id=? WHERE id=?',
               [
                    req.body.bike_id || null,
                    req.body.host_id || null,
                    req.body.customer_id || null,
                    req.body.rating_score,
                    req.body.rating_details,
                    req.body.rated_by_id,
                    req.body.contract_id,
                    req.body.ratingId
               ], (err, result) => {
                   if(err){
                       res.send({err:err});
                   }else{
                       res.send(result);
                   }
               });
})

router.post('/user', authHelpers.checkAuthenticated, async(req, res)=>{
    console.log(req.body);
    pool.query('SELECT * from user where id=?',[req.body.userId],async (err,result) => {
        if(err){
            res.send({err:err});
        }else{
            if(result.length == 0){
                res.send({err:"no user found"});
            }else{
                let oldUserInfo = {...result[0]};
                //rehash the new password
                const bcrypt = require('bcrypt');
                let newPassword = result[0].password;
                if(req.body.password != null){
                    newPassword = await bcrypt.hash(req.body.password,10);
                }
                pool.query('UPDATE user SET user_name=?, password=?, first_name=?, last_name=?, email=? WHERE id=?',
                            [req.body.user_name || result[0].user_name,
                             newPassword,
                             req.body.first_name || result[0].first_name,
                             req.body.last_name || result[0].last_name,
                             req.body.email || result[0].email,
                             req.body.userId
                            ],
                             (err, result) => {
                                 if(err){
                                     res.send({err:err});
                                 }else{
                                     res.send({
                                         isAuthenticated:true,
                                         user:{
                                             user_name:req.body.user_name || oldUserInfo.user_name,
                                             email:req.body.email || oldUserInfo.email,
                                             id:req.body.userId,
                                             first_name:req.body.first_name || oldUserInfo.first_name,
                                             last_name:req.user.last_name || oldUserInfo.last_name
                                         }
                                     });
                                 }
                             })
            }
        }
    });
})

router.put('/bike/:id', authHelpers.checkAuthenticated,async (req, res) => {
    console.log(req.body);
    console.log(req.body.category);
    console.log(req.body.bikeFeatures);
    console.log(req.params.id);

    // Get the new Location Id
    let newLocID = await addBikeHelpers.getLocationID({
        street: req.body.address,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip,
        lat: 0,  //fetch googlemap for exact lat, long later
        long: 0
    });
    if(newLocID.err != undefined){
        newLocID = null;
    }

    let currentPrice;
    if (req.body.rentPrice == undefined) {
        currentPrice = await checkSameRentalPrice(req.params.id);
    }else {
        currentPrice = req.body.rentPrice;
    }


    // Set the properties to the current fields of the bike obj passed in, ok if some properties are null
    let newBike = {
        location_id: newLocID.location_id,
        functional:1,
        price: currentPrice,
        penalty: String(Number(currentPrice) * 0.25),  //25% of rental price penalty
        bike_details: req.body.bikeDesc,
        bikeName: req.body.bikename,
        bikeBrand: req.body.bikeBrand
    };

    pool.query("SELECT * FROM bike WHERE id=?", [req.params.id], async function (err, result) {
        if (err) {
            res.send({err:err});
        }
        else if (result.length > 0) {
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
                ], async (err,result)=>{
                        if(err){
                            res.send({err:err});
                        }else{
                            let status = {status: 'Bike updated', bikeId: req.params.id};
                            if(newBike.location_id == undefined){
                                status.err = "Error updating location!";
                            }
                            console.log(status);
                            status.bikeCatStatus = await updateBikeCategory({bikeId:status.bikeId,catName:req.body.category});
                            status.bikeFeatureStatus = await updateBikeFeatures(req.body.bikeFeatures, status.bikeId);
                            res.send(status);                          
                        }               
                }
            )
        }else{
            res.send({err:"No bike was found!"});
        }
    });


});


function updateBikeCategory(newCatObj){
    let promise = new Promise(async(resolve, reject) => {
        //remove old category M:M relationship
        pool.query('DELETE FROM bike_category WHERE bike_id=?',[newCatObj.bikeId],(err, result) => {
            if(err){
                resolve({err:err})
            }else{
                resolve(addBikeHelpers.addBikeCategory(newCatObj));
            }
        })
    });
    return promise;
}


function updateBikeFeatures(newBikeFeatures,bikeId){
    let promise = new Promise((resolve, reject) => {
        //remove all old features
        pool.query('DELETE FROM bike_feature WHERE bike_id=?',[bikeId],(err,result) => {
            if(err){
                resolve({err:err});
            }else{
                //now add the new M:M relationship
                resolve(addBikeHelpers.addBikeFeatures(newBikeFeatures,bikeId));
            }
        })
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

module.exports = router;
