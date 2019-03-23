const UserDao = require('../dao/user-dao');
const UserModel = require('../model/user-model');
const HealConfig = require('../../config/heal-config');
const UserLevelConfig = require('../../config/user-level-config');
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

let spendMoney = function(username, amount){
    return new Promise(function (resolve, reject) {
        UserDao.findByUsername(username).then(user=>{
            if (user.gold>=amount){
                return UserDao.spendMoney(username, user.gold, amount);
            }else{
                reject(false);
            }
        }).then(result=>{
            resolve(result);
        }).catch(err=>{
            reject(err);
        })
    })
};

let heal = function(username){
    return new Promise(function (resolve, reject) {
        let cost = HealConfig.COST;
        spendMoney(username, cost).then(result=>{
            if (result){
                return UserDao.findByUsername(username);
            }else{
                reject('余额不足');
            }
        }).then(user=>{
            return UserDao.setHpAndMP(username, user.maxHp, user.maxMp);
        }).then(res=>{
            resolve(res);
        }).catch(err=>{
            reject(err);
        });
    })
};

let getLevelInfo = function(){
    return new Promise(function (resolve, reject) {
        resolve(UserLevelConfig);
    }).catch(err=>{
        reject(err);
    })
};
exports.getUserInfo = getUserInfo;
exports.markUserPosition = markUserPosition;
exports.spendMoney = spendMoney;
exports.heal = heal;
exports.getLevelInfo = getLevelInfo;