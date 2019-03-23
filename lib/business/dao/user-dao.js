const mongoose = require('mongoose');
const Conf = require('../../config/config');
const conn =mongoose.createConnection(Conf.MONGO.URL+Conf.MONGO.DB1); //连接mongodb数据库
const logger = require('../../util/logger-factory').newLogger('user-dao');

var Schema = mongoose.Schema;


var UserSchema = new Schema({
    username    :   String,
    mapIndex    :   {type:Number, default:0},
    xAxis       :   {type:Number, default:0},
    yAxis       :   {type:Number, default:0},
    level       :   {type:Number, default:0},
    hp          :   Number,
    mp          :   Number,
    maxHp       :   Number,
    maxMp       :   Number,
    exp         :   {type:Number, default:0},
    gold        :   {type:Number, default:0},
    potential   :   {type:Number, default:0},
    atk         :   Number,
    def         :   Number,
    magic       :   Number,
    weapon      :   String,
    armor       :   String,
}, {
    versionKey: false // 不需要versionkey
});
UserSchema.index({username:1}, {unique:true});



mongoose.model('User', UserSchema, 'User');
let UserDao = conn.model('User');


let save = function (user) {
    return new Promise(function (resolve,reject) {
        new UserDao(user).save(function (err, res) {
            if(err){
                logger.error(err,__info);
                reject(err);
            }else{
                resolve(res);
            }
        });
    });
};

let spendMoney = function (username, nowGold, spendMoney) {
    return new Promise(function (resolve, reject) {
        let query = {
            username:username,
            gold:nowGold
        };
        let update = {
            $inc:{
                gold:-spendMoney
            }
        };
        let options = {
            upsert:false,
            multi:false
        };
        UserDao.update(query, update, options).exec().then(result=>{
            logger.info(JSON.stringify(result), __info);
            resolve(convertUpdateResult(result));
        }).catch(err=>{
            logger.error(err, __info);
            reject(err);
        })
    })
};

let convertUpdateResult = function (updateResult) {
    if (updateResult.nModified){
        return true;
    }else{
        return false;
    }
};

let findByUsername = function (username) {
    return new Promise(function (resolve, reject) {
        let query = {
            username:username,
        };
        UserDao.findOne(query).exec().then(oneDoc=>{
            resolve(oneDoc);
        }).catch(err=>{
            logger.error(err, __info);
            reject(err);
        })
    })
};

let setPosition = function(username, mapId, xAxis, yAxis){
    return new Promise(function (resolve ,reject) {
        let query = {
            username:username,
        };
        let update = {
            $set:{
                mapIndex:mapId,
                xAxis:xAxis,
                yAxis:yAxis
            }
        };
        let options = {
            upsert:false,
            multi:false
        };
        UserDao.update(query, update, options).exec().then(result=>{
            result = convertUpdateResult(result);
            resolve(result);
        }).catch(err=>{
            logger.error(err, __info);
            reject(err);
        })
    })
};

let setHpAndMP = function(username, targetHP, targetMP){
    return new Promise(function (resolve, reject) {
        let query = {
            username : username,
            maxHp : {$gte:targetHP},
            maxMp : {$gte:targetMP}
        };

        let update = {
            hp: targetHP,
            mp: targetMP
        };
        let options = {
            upsert:false,
            multi:false
        };
        UserDao.update(query, update, options).exec().then(result=>{
            result = convertUpdateResult(result);
            resolve(result);
        }).catch(err=>{
            logger.error(err, __info);
            reject(err);
        })
    })
};

let levelUp = function(username, needExp, potential){
    return new Promise(function (resolve, reject) {
        let query = {
            username : username,
            exp:{$gte:needExp}
        };

        let update = {
            $inc:{
                exp:-needExp,
                potential:potential,
                level:1
            }
        };
        let options = {
            upsert:false,
            multi:false
        };
        UserDao.update(query, update, options).exec().then(result=>{
            result = convertUpdateResult(result);
            resolve(result);
        }).catch(err=>{
            logger.error(err, __info);
            reject(err);
        })
    });
};

let allocPotential = function(username, totalCost, magic, atk, def, hp, mp){
    return new Promise(function (resolve, reject) {
        let query = {
            username : username,
            potential:{$gte:totalCost}
        };

        let update = {
            $inc:{
                magic:magic,
                atk:atk,
                def:def,
                maxHp:hp,
                maxMp:mp,
                potential:-totalCost
            }
        };
        let options = {
            upsert:false,
            multi:false
        };
        UserDao.update(query, update, options).exec().then(result=>{
            result = convertUpdateResult(result);
            resolve(result);
        }).catch(err=>{
            logger.error(err, __info);
            reject(err);
        })
    })
};

exports.save = save;
exports.findByUsername = findByUsername;
exports.setPositon = setPosition;
exports.spendMoney = spendMoney;
exports.setHpAndMP = setHpAndMP;
exports.levelUp = levelUp;
exports.allocPotential = allocPotential;