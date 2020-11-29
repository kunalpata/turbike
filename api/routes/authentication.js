const express = require('express');
const router = express.Router();
const authHelpers = require('../helpers/authenticateHelpers.js');
const passport = require('passport');
const pool = require('../dbcon.js').pool;

router.post('/login', authHelpers.checkNotAuthenticated, (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if(err) res.send({err:err});
        if(!user){
            res.send({login:false,err:"No user found"});
        }else{
            req.logIn(user, err => {
                if(err){
                    res.send({login:false,err:err});
                }else{
                    res.send({
                        login:true,
                        user: {
                            user_name:req.user.user_name, 
                            email:req.user.email,
                            id:req.user.id,
                            first_name: req.user.first_name,
                            last_name:req.user.last_name
                          }
                    });
                }
            })
        }
    })(req,res,next)
});

router.post('/register', authHelpers.checkNotAuthenticated, async (req, res) => {
    let registerResult = await authHelpers.registerUser(req.body, pool);
    res.send(registerResult);
});

router.get('/logout', authHelpers.checkAuthenticated, (req, res) => {
    req.logOut();
    res.send({isAuthenticated: false, isLogOut:true});
})

router.get('/user', authHelpers.checkAuthenticated, (req, res) => {
    res.send({
        isAuthenticated:true,
        user:{
            user_name:req.user.user_name,
            email:req.user.email,
            id:req.user.id,
            first_name:req.user.first_name,
            last_name:req.user.last_name
        }
    })
})

module.exports = router;