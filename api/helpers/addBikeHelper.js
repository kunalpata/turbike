// addBikesHelpers.js

let methods = {
    
    addBikeFeatures: async function(selectedFeatures, bikeId){
        let promise = new Promise(async (resolve, reject) => {
            let featureArr = [];
            for(let key in selectedFeatures){
                if(selectedFeatures[key]){
                    featureArr.push({bikeId:bikeId,featureId:key});
                }       
            }
    
            const pArray = featureArr.map(methods.addOneBikeFeature);
            let allBikeFeatures = await Promise.all(pArray);
            resolve(allBikeFeatures);
        });
        return promise;
        
    },
    
    
    addOneBikeFeature: function(bikeFeature){
        //bikeFeature is an object: {bikeId:, featureId:}
        const mysql = require('../dbcon').pool;
        let promise = new Promise((resolve, reject) => {
            mysql.query('INSERT INTO bike_feature (bike_id,feature_id) VALUES (?,?)', 
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
    },
    
    
    addBikeCategory: function(relationship){
        const mysql = require('../dbcon').pool;
        let promise = new Promise(async(resolve, reject) => {
            //relationship: {bikeId:,catName:}
            let catId = await methods.getCategoryID(relationship.catName);
            if(catId["err"] == undefined){
                //add relationship to bike_category
                mysql.query('INSERT INTO bike_category (bike_id,category_id) VALUES (?,?)',
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
    },
    
    
    getCategoryID: function(catName){
        const mysql = require('../dbcon').pool;
        let promise = new Promise((resolve, reject) => {
            mysql.query('SELECT * FROM category WHERE name=?',[catName], (err, result) => {
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
    },

    getLocationID: function(address){  //address is an object: {street:,city:,state:,zip:,lat:,long:}, lat, long to be implemented later
        const mysql = require('../dbcon').pool;
        let promise = new Promise(async (resolve, reject)=>{
            //query database for location_id
            mysql.query('SELECT * FROM location WHERE address=? AND city = ? AND state = ? AND zip = ?',
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
    },

};


function addNewLocation(address){  //add a new location if address is not in location table and return new location_id
    const mysql = require('../dbcon').pool;
    let promise = new Promise(async (resolve, reject)=>{
        console.log(address);
        //retrieve lat/long first
        let locationInfo = await getLatLong(address);
        
        if(locationInfo['err'] == undefined){
            mysql.query('INSERT INTO location (address,city,state,zip,latitude,longitude)' + 
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
    const fetch = require('node-fetch');
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

module.exports = methods;