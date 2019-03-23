const mongoose = require('mongoose');
const Conf = require('../../config/config');
const conn =mongoose.createConnection(Conf.MONGO.URL+Conf.MONGO.DB1); //连接mongodb数据库
const logger = require('../../util/logger-factory').newLogger('equipment-dao');

var Schema = mongoose.Schema;


var EquipmentSchema = new Schema({
    type: Number,
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

exports.save = save;
exports.findByUsername = findByUsername;