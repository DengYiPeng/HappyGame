const mongoose = require('mongoose');
const Conf = require('../../config/config');
const conn =mongoose.createConnection(Conf.MONGO.URL+Conf.MONGO.DB1); //连接mongodb数据库
const logger = require('../../util/logger-factory').newLogger('message');

var Schema = mongoose.Schema;


var UserSchema = new Schema({
    username    :   String,
    mapIndex    :   {type:Number, default:0},
    xAxis       :   {type:Number, default:0},
    yAxis       :   {type:Number, default:0},
    level       :   {type:Number, default:0},
    hp          :   {type:Number, default:0},
    mp          :   {type:Number, default:0},
    exp         :   {type:Number, default:0},
    gold        :   {type:Number, default:0},
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
            resolve(true);
        }).catch(err=>{
            logger.error(err, __info);
            reject(err);
        })
    })
};

let setHp = function(username, targetHP){
    return new Promise(function (resolve, reject) {
        let query = {
            username : username,
            maxHp : {$gte:targetHP}
        };

        let update = {
            hp: targetHP
        };
        let options = {
            upsert:false,
            multi:false
        };
        UserDao.update(query, update, options).exec().then(result=>{
            resolve(true);
        }).catch(err=>{
            logger.error(err, __info);
            reject(err);
        })
    })
};

exports.save = save;
exports.findByUsername = findByUsername;
exports.setPositon = setPosition;

exports.setHp = setHp;