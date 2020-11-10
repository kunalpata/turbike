const express = require('express');
const router = express.Router();
const pool = require('../dbcon').pool;

//add dotenv functionality
require('dotenv').config();

//get all categories
router.get('/categories', async (req, res) => {
    
    let categories = await getFromTable('category', '*', '1', '1');
    res.send(JSON.stringify(categories));

});

//get all features
router.get('/features', async (req, res) => {
    
    let features = await getFromTable('feature', '*', '1', '1');
    res.send(JSON.stringify(features));

});


function getFromTable(tableName, columns, targetColumn, targetValue){
    let promise = new Promise((resolve, reject) => {
        let query = `SELECT ${columns} FROM ${tableName} WHERE '${targetColumn}' = '${targetValue}'`;
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