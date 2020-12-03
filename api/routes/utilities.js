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

//get contracts with specific user_id
router.get('/contracts', async (req, res) => {
    console.log(req.query);
    //get the user host_id and customer_id
    let {user_host_id,user_customer_id} = await getHostCustomerIds(req.query.userId);
    console.log(user_host_id,user_customer_id);
    if(user_host_id == -1 || user_customer_id == -1){
        res.send({err:"error getting host/customer ids"});
    }else{
        let query = 'SELECT c.*, t1.host_user_name, t2.customer_user_name, b.bikeName, b.brand, b.price, b.penalty from contract c '+
                    'inner join (SELECT u.user_name as host_user_name, u.first_name as host_first_name, u.last_name as host_last_name, h.id as host_id from user u inner join host h on u.id = h.user_id) as t1 ' +
                    'on c.host_id = t1.host_id '+
                    'inner join (SELECT u.user_name as customer_user_name, u.first_name as customer_first_name, u.last_name as customer_last_name, ct.id as customer_id from user u inner join customer ct on u.id = ct.user_id) as t2 '+
                    'on c.customer_id = t2.customer_id inner join bike b on b.id = c.bike_id WHERE (c.host_id=? or c.customer_id=?)';
        pool.query(query,[user_host_id,user_customer_id],(err, result) => {
            if(err){
                res.send({err:err});
            }else{
                res.send({curUser_host_id:user_host_id,curUser_customer_id:user_customer_id,results:[...result]});
            }
        })
    }
})

// get contract dates by bike id
router.get('/contracts/dates', async (req, res) => {
  let query = 'SELECT start_datetime, expiration_datetime ' +
              'FROM contract ' +
              'WHERE bike_id=? ' +
              'AND status=?'

  pool.query(query, [req.query.bikeId, "pending"], (err, result) => {
    if (err) {
      res.send({err:err});
    } else {
      res.send({dates:result});
    }
  })  
});

//get all the ratings for a specific contract and rated by a user
router.post('/rating', async (req, res) => {
    pool.query('SELECT * FROM rating WHERE contract_id=? and rated_by_id=?',
               [req.body.contract_id, req.body.user_id],
               (err, result) => {
                   if(err){
                       res.send({err:err});
                   }else{
                       if(result.length == 0){
                           res.send({feedbackCt:0});
                       }else{
                           //return object with identified feedback
                           let feedbacks = {feedbackCt:result.length};
                           for(let i = 0; i < result.length; i++){
                               if(result[i].bike_id != undefined){
                                   feedbacks.bike = {...result[i]};
                               }else if(result[i].host_id != undefined){
                                   feedbacks.host = {...result[i]};
                               }else if(result[i].customer_id != undefined){
                                   feedbacks.customer = {...result[i]};
                               }
                           }
                           res.send(feedbacks);
                       }
                   }
               })
})

//get ratings for either bike, host or customer
router.get('/ratings', async (req, res) => {
    let targetId = "bike_id";
    if(req.query.type == "host")
        targetId = "host_id";
    else if(req.query.type == "customer")
        targetId = "customer_id";

    pool.query('SELECT * FROM rating WHERE ' + targetId + '=? ORDER BY id DESC',[req.query.id],
                (err, result) => {
                    if(err){
                        res.send({err:err});
                    }else{
                        res.send([...result]);
                    }
                })
})

//helper functions

function getHostCustomerIds(userId){
    let promise = new Promise((resolve, reject) => {
        let query = 'Select t1.id as user_id, h.id as host_id, t1.customer_id from host h ' + 
                    'inner join (SELECT u.*,ct.id as customer_id from user u ' + 
                    'inner join customer ct on u.id = ct.user_id) as t1 on t1.id = h.user_id ' + 
                    'Where user_id = ?';
        pool.query(query,[userId],async(err, result) => {
            if(err){
                resolve({user_host_id:-1});
            }else{
                if(result.length == 0){
                    resolve({user_host_id:-1});
                }else{
                    resolve({user_host_id:result[0].host_id,user_customer_id:result[0].customer_id});
                }
            }
        })
    });
    return promise;
}


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
