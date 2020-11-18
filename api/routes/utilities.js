const express = require('express');
const router = express.Router();
const pool = require('../dbcon').pool;

//add dotenv functionality
require('dotenv').config();

//get all categories
router.get('/categories', async (req, res) => {
    
    let categories = await getFromTable('category', '*', '1', '1', true);
    res.send(JSON.stringify(categories));

});

//get all features
router.get('/features', async (req, res) => {
    
    let features = await getFromTable('feature', '*', '1', '1', true);
    res.send(JSON.stringify(features));

});

//get all cities
router.get('/cities', async (req, res) => {
    
    let locations = await getFromTable('location', 'city', '1', '1', true);
    res.send(JSON.stringify(locations));

});


function getFromTable(tableName, columns, targetColumn, targetValue, distinct){
    let promise = new Promise((resolve, reject) => {
        let query = distinct? "SELECT DISTINCT":"SELECT";

        query = `${query} ${columns} FROM ${tableName} WHERE '${targetColumn}' = '${targetValue}'`;
        pool.query(query, (err, result) => {
            if(err){
                resolve({data:[],err:err,hasError:1});
                
            }else{
                let items = [];
                for (let i = 0; i < result.length; i++){
                    let item = {
                        ...result[i],
                    }
                    items.push(item);
                }
                //console.log(items)
                resolve({data:items,err:"",hasError:0});
            }
        })
    });
    return promise;
}

module.exports = router;