const express = require('express');
const router = express.Router();
const pool = require('../dbcon').pool;
const authHelpers = require('../helpers/authenticateHelpers.js');
const fetch = require('node-fetch');

//add dotenv functionality
require('dotenv').config();

//Add new bike, user must login to add bike
router.post('/bike', authHelpers.checkAuthenticated, async (req, res) => {
    console.log(req.body); //body should have {user_id:,streetAddress:,city:,state:,zip:,functional:,price:,penalty:,bike_details:}
    console.log("user",req.user);
    let location_id = await getLocationID({ street: req.body.address,
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
                           status.bikeCatStatus = await addBikeCategory({bikeId:result.insertId,catName:req.body.category});
                           status.bikeFeatureStatus = await addBikeFeatures(req.body.bikeFeatures, status.bikeId);
                           res.send(status);
                           
                       }
                   });
        
    }else{
        res.send({err:location_id['err']});
    }
    
});


//helper function
async function addBikeFeatures(selectedFeatures, bikeId){
    let promise = new Promise(async (resolve, reject) => {
        let featureArr = [];
        for(let key in selectedFeatures){
            if(selectedFeatures[key]){
                featureArr.push({bikeId:bikeId,featureId:key});
            }       
        }

        const pArray = featureArr.map(addOneBikeFeature);
        let allBikeFeatures = await Promise.all(pArray);
        resolve(allBikeFeatures);
    });
    return promise;
    
}


function addOneBikeFeature(bikeFeature){
    //bikeFeature is an object: {bikeId:, featureId:}
    let promise = new Promise((resolve, reject) => {
        pool.query('INSERT INTO bike_feature (bike_id,feature_id) VALUES (?,?)', 
                    [bikeFeature.bikeId,bikeFeature.featureId],
                    (err, result) => {
                        if(err){
                            resolve({err:err});
                        }else{
                            resolve({bikeFeatureId:result.insertId});
                        }
                    })
    });
    return promise;
}


function addBikeCategory(relationship){
    let promise = new Promise(async(resolve, reject) => {
        //relationship: {bikeId:,catName:}
        let catId = await getCategoryID(relationship.catName);
        if(catId["err"] == undefined){
            //add relationship to bike_category
            pool.query('INSERT INTO bike_category (bike_id,category_id) VALUES (?,?)',
                        [relationship.bikeId, catId.catId],(err,result) => {
                            if(err){
                                resolve({err:err});
                            }else{
                                resolve({bike_catId:result.insertId});
                            }

            });
        }else{
            resolve({err:catId["err"]});
        }
    });
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
                                if(newLocID['err'] == undefined){
                                    resolve({location_id: newLocID.location_id});
                                }else{
                                    resolve({err:newLocID['err']});
                                }
                                
                            }else{
                                resolve({location_id: result[0].id});
                            }
                        }
                    })
    });
    return promise;
}

function addNewLocation(address){  //add a new location if address is not in location table and return new location_id
    let promise = new Promise(async (resolve, reject)=>{
        console.log(address);
        //retrieve lat/long first
        let locationInfo = await getLatLong(address);
        
        if(locationInfo['err'] == undefined){
            pool.query('INSERT INTO location (address,city,state,zip,latitude,longitude)' + 
                'VALUES (?,?,?,?,?,?)',
                [
                    address.street,
                    address.city,
                    address.state,
                    address.zip,
                    locationInfo.location.lat,
                    locationInfo.location.lng
                ], (err,result)=>{
                    if(err){
                        resolve({err:err});
                    }else{
                        resolve({location_id:result.insertId});
                    }
            });
        }else{
            resolve({err:locationInfo['err']});
        }
        
    });
    return promise;
}

function getLatLong(address){
    let promise = new Promise(async (resolve, reject) => {
        let addressString = address.street + ', ' + address.city + ', ' + address.state;
        addressString = addressString.replace(/\s/g, '+');
        console.log(addressString);
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


module.exports = router;