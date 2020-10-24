const pool = require("../dbcon.js").pool;
const bcrypt = require("bcrypt");
const localStrategy = require("passport-local").Strategy;

module.exports = function (passport, complete){
    passport.use(
        new localStrategy(async (username, password, done) => {
            //find the user from the database and compare password
            pool.query('SELECT * FROM user WHERE user_name=?',[username] , async (err, results) => {
                if(err){
                    return done(null, false, { message: err });
                }else{
                    
                    if(results.length == 0){
                        return done(null, false, { message: 'No user found' });
                    }else{
                        //user found, check password
                        await bcrypt.compare(password, results[0].password, (err, result) => {
                            complete({user:username,pass:password, results:results});
                            if(err) return done(null, false, { message: err });
                            if (result === true){
                                return done(null, results[0]);
                            }else{
                                return done(null, false, { message: 'Password incorrect' });
                            }
                        });
                    }
                }
            })
        })
    );

    passport.serializeUser((user, cb) => {
        cb(null, user.id);
    });

    passport.deserializeUser((id, cb) => {
        pool.query('SELECT * FROM user WHERE id=?', [id], (err, results) => {
            cb(err, results[0]);
        })
    })
}