var methods = {
    checkExists: function (target, targetfield, tableName, mysql){
        let promise = new Promise((resolve, reject) => {
            let query = `SELECT * from ${tableName} WHERE ${targetfield} = '${target}'`;
            mysql.query(query, (err, results) => {
                if(err){
                    resolve({err:err});
                }else{
                    let matchedArr = [];
                    for(let i = 0; i < results.length; i++){
                        let curItem = {...results[0]};
                        
                        //console.log(curItem);
                        matchedArr.push(curItem);
                    }
                    resolve({
                        isExist: (results.length != 0)? true:false,
                        matched: matchedArr,
                        target: target,
                        targetfield: targetfield,
                        tableName: tableName
                    });
                }
            })
        });
        return promise;
    },

    registerUser: function (userInfo, mysql){
        const bcrypt = require("bcrypt");
        let promise = new Promise(async (resolve, reject) => {
            let checkUserName = await methods.checkExists(userInfo.regUsername, "user_name", "user", mysql);
            let checkEmail = await methods.checkExists(userInfo.regEmail, "email", "user", mysql);

            if(checkUserName.isExist || checkEmail.isExist){
                resolve({err: "User exists!"});
            }else{
                //register the user
                const hashedPassword = await bcrypt.hash(userInfo.regPassword,10);
                let query = `INSERT INTO user (user_name,password,first_name,last_name,email) 
                            VALUES ('${userInfo.regUsername}','${hashedPassword}','${userInfo.regFirstname}','${userInfo.regLastname}','${userInfo.regEmail}')`;
                mysql.query(query, (err, result) => {
                    if(err){
                        resolve({err:err});
                    }else{
                        resolve({isRegister:true,newId:result.insertId});
                    }
                })

            }
        });
        return promise;
    },

    checkAuthenticated: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        res.send({isAuthenticated:false});
    },

    checkNotAuthenticated: function(req, res, next){
        if(!req.isAuthenticated()){
            
            return next();
        }
        
        res.send({isAuthenticated:true});
    }

};

module.exports = methods;