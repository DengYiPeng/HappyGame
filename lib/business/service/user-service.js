const UserDao = require('../dao/user-dao');
const UserModel = require('../model/user-model');

let getUserInfo = function (username) {
    return new Promise(function (resolve, reject) {
        let newUser = new UserModel(username);
        UserDao.findByUsername(username).then(user=>{
            if (user){
                newUser = user;
                return user;
            }else{
                return UserDao.save(newUser);
            }
        }).then(result=>{
            resolve(newUser);
        }).catch(err=>{
            reject(err);
        })
    })
};

let markUserPosition = function(username, mapId, xAxis, yAxis){
    return new Promise(function (resolve, reject) {
        UserDao.setPositon(username, mapId, xAxis, yAxis).then(result=>{
            resolve(result);
        }).catch(err=>{
            reject(err);
        })
    })
};


exports.getUserInfo = getUserInfo;
exports.markUserPosition = markUserPosition;