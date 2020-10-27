const express = require('express');
const router = express.Router();

//This file contains all routing information

//used to show home page
//router.use('/', require('./home.js'));

//add item page
router.use('/api/add', require('./add.js'));

//get bikes 
router.use('/api/getBikes', require('./bikes.js'));

//delete item page
//router.use('/delete', require('./delete.js'));

//update item page
//router.use('/update', require('./update.js'));

//display items
//router.use('/api/searchBikes', require('./searchBikes.js'));

//aws file storage
//router.use('/aws', require('./aws.js'));

//input validation
router.use('/api/check', require('./inputValidate.js'));

//Authentication
router.use('/api/auth', require('./authentication.js'));

module.exports = router;