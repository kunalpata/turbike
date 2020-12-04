const express = require('express');
const router = express.Router();
const pool = require('../dbcon').pool;

//add dotenv functionality
require('dotenv').config();

//get all bikes information
router.get('/', (req, res) => {
    let query = 'SELECT b.id,b.price,b.bike_details,u.user_name,u.email,l.address,l.city,l.state,l.zip' +
                ' FROM bike b inner join user u on b.user_id = u.id ' + 
                'inner join location l on b.location_id = l.id;'

    pool.query(query, (err, result)=>{
        if(err){
            res.send({data:[],err:err,hasError:1});
            
        }else{
            let items = [];
            for (let i = 0; i < result.length; i++){
                let item = {
                    ...result[i],
                }
                items.push(item);
            }
            // console.log(items)
            res.send(JSON.stringify({data:items,err:"",hasError:0}));
        }
    });
});

router.post('/submittedBikes', (req, res) => {
    console.log(req.body.user.email);
    let user = req.body.user.email;
    let query = 'SELECT b.id,b.bikeName,b.brand,b.price,b.bike_details,u.user_name,u.email,l.address,l.city,l.state,l.zip' +
        ' FROM bike b inner join user u on b.user_id = u.id ' +
        'inner join location l on b.location_id = l.id;'

    pool.query(query, (err, result)=>{
        if(err){
            res.send({data:[],err:err,hasError:1});

        }else{
            let items = [];
            for (let i = 0; i < result.length; i++){
                let item = {
                    ...result[i],
                }
                items.push(item);
            }
            // console.log(items.length);

            let bikes = [];
            for (let i = 0; i < items.length; i++) {
                if (user == items[i].email) {
                    bikes.push(items[i]);
                }
            }

            // console.log(bikes);

            if (bikes.length === 0) {
                res.send({data:[],err:"",hasError:1});
            }else {
                // send back an obj
                res.send(JSON.stringify({data:bikes,err:"",hasError:0}));
            }
        }
    });

});

router.post('/getRandomBikes', (req, res) => {
    let userID = req.body.user.user_name;

    let query = 'SELECT b.id,b.bikeName,b.brand,b.price,b.bike_details,u.user_name,u.email,l.address,l.city,l.state,l.zip' +
        ' FROM bike b inner join user u on b.user_id = u.id ' +
        'inner join location l on b.location_id = l.id;';

    pool.query(query, (err, result)=>{
        if(err){
            res.send({data:[],err:err,hasError:1});

        }else{
            // console.log(result[6]);

            let ceiling = result.length - 1;
            console.log(ceiling);

            let storeNum = [];
            // 10 Random bikes
            for (let i = 0; i < ceiling; i++) {
                let idx = Math.floor(Math.random() * ceiling);
                storeNum[i] = idx;
            }

            let unique = storeNum.filter((item, i, ar) => ar.indexOf(item) === i);

            let bikes = [];
            for (let i = 0; i < unique.length; i++){
                if (userID !== result[unique[i]].user_name) {
                    console.log("UNQ ID: " + result[unique[i]].id);

                    let item = {
                        ...result[unique[i]],
                    }
                    bikes.push(item);
                }
            }

            // console.log(bikes);

            res.send(JSON.stringify({data:bikes,err:"",hasError:0}));
        }
    })

});

module.exports = router;