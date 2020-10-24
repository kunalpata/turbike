const express = require('express');
const router = express.Router();
const pool = require('../dbcon.js').pool;
const authHelpers = require('../helpers/authenticateHelpers.js');

router.post('/checkRegisterInfo', async (req, res) =>{
    let {target, targetfield, tableName} = req.body;
    let checkResult = await authHelpers.checkExists(target, targetfield, tableName, pool);
    res.send(checkResult);
});

module.exports = router;