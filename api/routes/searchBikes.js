const express = require('express');
const router = express.Router();
const pool = require('../dbcon').pool;

//add dotenv functionality
require('dotenv').config();

//get all bikes information
router.get('/', (req, res) => {
    let loc = '%' + req.query.loc + '%';

    let query = 'SELECT b.id,b.price,b.bike_details,u.user_name,u.email,l.address,l.city,l.state,l.zip,l.latitude,l.longitude' +
                ' FROM bike b inner join user u on b.user_id = u.id ' + 
                'inner join location l on b.location_id = l.id ' +
                'WHERE l.city LIKE ? or l.state LIKE ? or l.zip LIKE ? ' +
                'LIMIT 10;'

    pool.query(query, [loc, loc, loc], (err, result)=>{
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
            //console.log(items)
            res.send(JSON.stringify({data:items,err:"",hasError:0}));
        }
    });
});

module.exports = router;