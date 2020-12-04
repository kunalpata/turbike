const express = require('express');
const router = express.Router();
const pool = require('../dbcon').pool;
const authHelpers = require('../helpers/authenticateHelpers.js');
const addBikeHelpers = require('../helpers/addBikeHelper.js');

//add dotenv functionality
require('dotenv').config();

//Add new bike, user must login to add bike
router.post('/bike', authHelpers.checkAuthenticated, async (req, res) => {
    console.log(req.body); //body should have {user_id:,streetAddress:,city:,state:,zip:,functional:,price:,penalty:,bike_details:}
    console.log("user",req.user);
    let location_id = await addBikeHelpers.getLocationID({ street: req.body.address,
                                            city: req.body.city,
                                            state: req.body.state,
                                            zip: req.body.zip,
                                            lat: 0,  //fetch googlemap for exact lat, long later
                                            long: 0});
    
    if(location_id['err'] == undefined){
        let newBike = {
            user_id:req.user.id,
            location_id: location_id.location_id,
            functional:1,
            price: req.body.rentPrice,
            penalty: String(Number(req.body.rentPrice) * 0.25),  //25% of rental price penalty
            bike_details: req.body.bikeDesc,
            bikeName: req.body.bikename,
            bikeBrand: req.body.bikeBrand
        };    
    
        pool.query('INSERT INTO bike (user_id, location_id, functional, price, penalty, bike_details, bikeName, brand) VALUES (?,?,?,?,?,?,?,?)',
                   [
                       newBike.user_id,
                       newBike.location_id,
                       newBike.functional,
                       newBike.price,
                       newBike.penalty,
                       newBike.bike_details,
                       newBike.bikeName,
                       newBike.bikeBrand
                   ], async (err,result)=>{
                       if(err){
                           res.send({err:err});
                           

                       }else{
                           let status = {status: 'Bike added', bikeId: result.insertId};
                           console.log(status);
                           status.bikeCatStatus = await addBikeHelpers.addBikeCategory({bikeId:result.insertId,catName:req.body.category});
                           status.bikeFeatureStatus = await addBikeHelpers.addBikeFeatures(req.body.bikeFeatures, status.bikeId);
                           res.send(status);
                           
                       }
                   });
        
    }else{
        res.send({err:location_id['err']});
    }
    
});


//add rating
router.post('/rating', authHelpers.checkAuthenticated, async (req, res) => {
    //build the query
    let columns = "("
    let targetId = "";
    if(req.body.bike_id !== undefined){
        columns = columns + "bike_id, ";
        targetId = req.body.bike_id;
    }else if(req.body.host_id !== undefined){
        columns = columns + "host_id, ";
        targetId = req.body.host_id;
    }else{
        columns = columns + "customer_id, ";
        targetId = req.body.customer_id;
    }

    columns = columns + "rating_score, rating_details, rated_by_id, contract_id)";
    pool.query('INSERT INTO rating ' + columns + ' VALUES (?,?,?,?,?)',
                [targetId, req.body.rating_score, req.body.rating_details, req.body.rated_by_id, req.body.contract_id],
                (err, result) => {
                    if(err){
                        res.send({err:err});
                    }else{
                        res.send({status:"success", insertId:result.insertId});
                    }
                });
});


// add contract
router.post('/contract', authHelpers.checkAuthenticated, async (req, res) => {
    let conInfo = req.body.contractInfo;
    conInfo.host_id = await getOtherIDFromUserId('host', conInfo.host_id);
    conInfo.customer_id = await getOtherIDFromUserId('customer', conInfo.customer_id);

    // build query to create contract
    let query = 'INSERT INTO contract ' +
                '(host_id, customer_id, bike_id, start_datetime, expiration_datetime, status, end_datetime) ' +
                'VALUES (?,?,?,?,?,"pending", null);'

    pool.query(query, 
        [conInfo.host_id, conInfo.customer_id, conInfo.bike_id, conInfo.start_datetime, conInfo.expiration_datetime], 
        (err, result) => {

        if (err) {
            console.log(err);
            res.send({err:err});
        } else {
            res.send({status: "success", insertId: result.insertId});
        }
    }); 
});


//helper function

/* Takes in a type of id to retreive (table name) and a user id. Gets the host or
customer id that corresponds to the passed in user id */
async function getOtherIDFromUserId(idType, userId){
    let promise = new Promise((resolve, reject) => {
        let query = 'SELECT * FROM ' + idType + ' WHERE user_id=?;'
        pool.query(query, [userId], (err, result) => {
            if(err){
                resolve({err:err});
            }else{
                if(result.length == 0){
                    resolve({err:"no such user", supplyId:userId});
                }else{
                    resolve(result[0].id);
                }
            }
        });
    });
    return promise;
}


module.exports = router;