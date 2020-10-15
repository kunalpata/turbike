const express = require('express');
const router = express.Router();
const pool = require('../dbcon').pool;

//add dotenv functionality
require('dotenv').config();

//get bike information
router.get('/', (req, res) => {
    pool.query('')
});


//helper function


module.exports = router;