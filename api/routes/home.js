const express = require('express');
const router = express.Router();
const pool = require('../dbcon').pool;

//add dotenv functionality
require('dotenv').config();

//get bike information
router.get('/', (req, res) => {

    // let query = 'SELECT b.bike_id,b.price,b.bike_details,u.user_name,u.email,l.address,l.city,l.state,l.zip' +
    //             ' FROM bike b inner join user u on b.user_id = u.user_id ' + 
    //             'inner join location l on b.location_id = l.location_id;'
    // pool.query(query, (err, result)=>{
    //     if(err){
    //         res.send({err:err});
    //     }else{
    //         let items = [];
    //         for (let i = 0; i < result.length; i++){
    //             let item = {
    //                 ...result[i],
    //             }
    //             items.push(item);
    //         }
    //         //console.log(items)
    //         res.send(JSON.stringify({data:items}));
    //         //res.render('../views/home',{data:items});
    //     }
    // });
});


//helper function


module.exports = router;