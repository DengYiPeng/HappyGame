const mongoose = require('mongoose');
const Conf = require('../../config/config');
const conn =mongoose.createConnection(Conf.MONGO.URL+Conf.MONGO.DB1); //连接mongodb数据库
const logger = require('../../util/logger-factory').newLogger('user-dao');
const RoleTypeConfig = require('../../config/role-type-config');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username    :   String,
    roleType    :   {type:Number, default:0},
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
    skills      :   Object
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
            if (!oneDoc) {
                resolve(null)
            }else{
                let newUser = {};
                newUser._id = oneDoc._id;
                newUser.username = oneDoc.username;
                newUser.roleType = oneDoc.roleType;
                newUser.mapIndex = oneDoc.mapIndex;
                newUser.xAxis = oneDoc.xAxis;
                newUser.yAxis = oneDoc.yAxis;
                newUser.level = oneDoc.level;
                newUser.hp = oneDoc.hp;
                newUser.mp = oneDoc.mp;
                newUser.maxHp = oneDoc.maxHp;
                newUser.maxMp = oneDoc.maxMp;
                newUser.exp = oneDoc.exp;
                newUser.gold = oneDoc.gold;
                newUser.potential = oneDoc.potential;
                newUser.atk = oneDoc.atk;
                newUser.def = oneDoc.def;
                newUser.magic = oneDoc.magic;
                newUser.weapon = oneDoc.weapon;
                newUser.armor = oneDoc.armor;
                newUser.skills = oneDoc.skills;
                resolve(newUser);
            }
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

let initRoleType = function(username, roleType){
    return new Promise(function (resolve, reject) {
        let query = {
            username: username,
            roleType: RoleTypeConfig.NEW_ROLE.type
        };
        let update = {
            $set:{
                roleType:roleType
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

let equipWeapon = function(username, equipmentId){
    return new Promise(function (resolve, reject) {
        let query = {
            username:username
        };
        let update = {
            $set:{
                weapon:equipmentId
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

let equipArmor = function(username, equipmentId){
    return new Promise(function (resolve, reject) {
        let query = {
            username:username
        };
        let update = {
            $set:{
                armor:equipmentId
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

let upskill = function(username, skillKey, newSkill){
    return new Promise(function (resolve, reject) {
        let query = {
            username:username
        };
        let update = {
        };
        let operation = '$inc';
        if (newSkill){
            operation = '$set';
        }
        update[operation] = {};
        update[operation]['skills.' +skillKey+'.level']  = 1;
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

let addGoldAndExp = function(username, gold, expValue){
    return new Promise(function (resolve, reject) {
        let query = {
            username: username,
        };
        let update = {
            $inc:{
                gold:gold,
                exp:expValue
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
exports.initRoleType = initRoleType;
exports.equipWeapon = equipWeapon;
exports.equipArmor = equipArmor;
exports.upSkill = upskill;
exports.addGoldAndExp = addGoldAndExp;