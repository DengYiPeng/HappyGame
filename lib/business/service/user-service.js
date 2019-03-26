const UserDao = require('../dao/user-dao');
const UserModel = require('../model/user-model');
const HealConfig = require('../../config/heal-config');
const UserLevelConfig = require('../../config/user-level-config');
const PotentialConfig = require('../../config/potential-config');
const RoleTypeConfig = require('../../config/role-type-config');
const DeathLossConfig = require('../../config/death-loss-config');
const FightService = require('../service/fight-service');
const EquipmentDao = require('../dao/equipment-dao');
const MultiUserService = require('../service/multi-user-service');

let getUserInfo = function (username) {
    return new Promise(function (resolve, reject) {
        UserDao.findByUsername(username).then(user=>{
            if (user){
                return getExistUserInfo(user);
            }else{
                let newUser = new UserModel(username);
                return UserDao.save(newUser);
            }
        }).then(result=>{
            return MultiUserService.cacheUserInfo(username, result);
        }).then(result=>{
            resolve(result);
        }).catch(err=>{
            console.log(err);
            reject(err);
        })
    })
};

let getExistUserInfo = function (user) {
    return new Promise(function (resolve, reject) {
        let promises = [];
        promises.push(EquipmentDao.findById(user.weapon));
        promises.push(EquipmentDao.findById(user.armor));

        Promise.all(promises).then(results=>{
            user.weaponInfo = results[0];
            user.armorInfo = results[1];
            resolve(user);
        }).catch(err=>{
           reject(err);
        });
    })
};

let markUserPosition = function(username, mapId, xAxis, yAxis, monsterType){
    return new Promise(function (resolve, reject) {
        getUserInfo(username).then(userInfo=>{
            return MultiUserService.cacheUserInfo(username, userInfo);
        }).then(result=>{
            return UserDao.setPositon(username, mapId, xAxis, yAxis);
        }).then(result=>{
            if (monsterType && monsterType > 0){
                return FightService.generateFight(username, monsterType);
            }else{
                return null;
            }
        }).then(fightInfo=>{
            resolve(fightInfo);
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

let levelUp = function(username){
    return new Promise(function (resolve, reject) {
        UserDao.findByUsername(username).then(user=>{
            let nowLevel = user.level;
            let needExp = UserLevelConfig[nowLevel];
            needExp || (needExp = 1000)
            let addPotential = PotentialConfig.POTENTIAL_OF_NEW_LEVEL;
            return UserDao.levelUp(username, needExp, addPotential);
        }).then(result=>{
            resolve(result);
        }).catch(err=>{
            reject(err);
        })
    })
};

let allocPotential = function(username, magic, atk, def, hp, mp){
    return new Promise(function (resolve, reject) {
        let totalCost = magic + atk + def + hp + mp;
        UserDao.findByUsername(username).then(user=>{
           let rolePotentialConfig = RoleTypeConfig[user.roleType];
           let realMagic = rolePotentialConfig.MAGIC_OF_EACH_LEVEL * magic;
           let realATK = rolePotentialConfig.ATK_OF_EACH_LEVEL * atk;
           let realDEF = rolePotentialConfig.DEF_OF_EACH_LEVEL * def;
           let realHP = rolePotentialConfig.DEF_OF_EACH_LEVEL * hp;
           let realMP = rolePotentialConfig.DEF_OF_EACH_LEVEL * mp;
           return UserDao.allocPotential(username, totalCost, realMagic, realATK, realDEF, realHP, realMP);
        }).then(res=>{
            resolve(res);
        }).catch(err=>{
            reject(err);
        });
    })
};

let initRoleType = function(username, roleType){
    return new Promise(function (resolve, reject) {
        UserDao.initRoleType(username,  roleType).then(result=>{
            resolve(result);
        }).catch(err=>{
            reject(err);
        })
    })
};


let getHealConfig = function(){
    return new Promise(function (resolve, reject) {
        resolve(HealConfig);
    }).catch(err=>{
        reject(err);
    })
};

let getRoleTypeConfig = function(){
    return new Promise(function (resolve, reject) {
        resolve(RoleTypeConfig);
    }).catch(err=>{
        reject(err);
    })
};

let winFight = function(username, gold, exp, hp, mp){
    return new Promise(function (resolve, reject) {
        let promises = [];
        promises.push(UserDao.setHpAndMP(username, hp, mp));
        promises.push(UserDao.addGoldAndExp(username, gold, exp));
        Promise.all(promises).then(result=>{
            resolve(result);
        }).catch(err=>{
            reject(err);
        })
    })
};

let failFight = function(username){
    return new Promise(function (resolve, reject) {
        UserDao.findByUsername(username).then(user=>{
            let gold_loss = Math.min(user.gold, DeathLossConfig.GOLD_LOSS);
            let exp_loss = Math.min(user.exp, DeathLossConfig.EXP_LOSS);
            let promises = [];
            promises.push(UserDao.addGoldAndExp(username, -gold_loss, -exp_loss));
            promises.push(UserDao.setHpAndMP(username, user.maxHp, user.maxMp));
            return Promise.all(promises);
        }).then(result=>{
            resolve(true);
        }).catch(err=>{
            reject(err);
        })
    })
};

exports.getUserInfo = getUserInfo;
exports.markUserPosition = markUserPosition;
exports.spendMoney = spendMoney;
exports.heal = heal;
exports.getLevelInfo = getLevelInfo;
exports.levelUp = levelUp;
exports.allocPotential = allocPotential;
exports.initRoleType = initRoleType;
exports.getHealConfig = getHealConfig;
exports.getRoleTypeConfig = getRoleTypeConfig;
exports.winFight = winFight;
exports.failFight = failFight;