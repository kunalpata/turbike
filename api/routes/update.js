const express = require('express');
const router = express.Router();
const pool = require('../dbcon').pool;
const authHelpers = require('../helpers/authenticateHelpers.js');

require('dotenv').config();

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

module.exports = router;