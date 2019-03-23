const mongoose = require('mongoose');
const Conf = require('../../config/config');
const conn =mongoose.createConnection(Conf.MONGO.URL+Conf.MONGO.DB1); //连接mongodb数据库
const logger = require('../../util/logger-factory').newLogger('equipment-dao');
var Schema = mongoose.Schema;


var EquipmentSchema = new Schema({
    tp: Number,
    templateKey: String,
    atk: Number,
    def: Number,
    magic: Number,
    username: String,
    level:  Number,
    strengthenLevel: {type:Number, default:0},
}, {
    versionKey: false // 不需要versionkey
});

mongoose.model('Equipment', EquipmentSchema, 'Equipment');
let EquipmentDao = conn.model('Equipment');


let save = function (equipment) {
    return new Promise(function (resolve,reject) {
        new EquipmentDao(equipment).save(function (err, res) {
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
        EquipmentDao.find(query).exec().then(docs=>{
            resolve(docs);
        }).catch(err=>{
            logger.error(err, __info);
            reject(err);
        })
    })
};

let findById = function(id){
    return new Promise(function (resolve, reject) {
        EquipmentDao.findById(id).exec().then(doc=>{
            resolve(doc);
        }).catch(err=>{
            logger.error(err, __info);
            reject(err);
        })
    })
};

let strengthen = function(id, key, value){
    return new Promise(function (resolve, reject) {
        let query = {
            _id:id
        };
        let update = {
            $inc:{
                strengthenLevel:1
            }
        };
        let options = {
            upsert:false,
            multi:false,
        };
        update.$inc[key] = value;
        EquipmentDao.update(query, update, options).exec().then(result=>{
            result = convertUpdateResult(result);
            resolve(result);
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

exports.save = save;
exports.findByUsername = findByUsername;
exports.findById = findById;
exports.strengthen = strengthen;