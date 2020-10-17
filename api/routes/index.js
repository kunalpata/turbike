const express = require('express');
const router = express.Router();

//This file contains all routing information

//used to show home page
router.use('/', require('./home.js'));

//add item page
router.use('/add', require('./add.js'));

//bike table page
router.use('/', require('./bikeTable.js'));

//delete item page
//router.use('/delete', require('./delete.js'));

//update item page
//router.use('/update', require('./update.js'));

//display items
//router.use('/search', require('./search'));

//aws file storage
//router.use('/aws', require('./aws.js'));

module.exports = router;