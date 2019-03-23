const EquipmentModel = require('../model/equipment-model');
const EquipmentDao = require('../dao/equipment-dao');
const EquipmentConfig = require('../../config/equipment-config');
const UserService = require('../service/user-service');
const UserDao = require('../dao/user-dao');
const EquipmentType = require('../../constants/EquipmentType');
const StrenthenConfig = require('../../config/strengthen-config');

let getEquipmentListInShop = function () {
    return new Promise(function (resolve, reject) {
        resolve(EquipmentConfig);
    })
};

let buyEquipment = function(username, equipmentKey){
    return new Promise(function (resolve, reject) {
        let equipmentTemplate = EquipmentConfig[equipmentKey];
        equipmentTemplate.ATK || (equipmentTemplate.ATK = 0);
        equipmentTemplate.DEF || (equipmentTemplate.DEF = 0);
        equipmentTemplate.MAGIC || (equipmentTemplate.MAGIC = 0);
        
        let newEquipment = new EquipmentModel(equipmentTemplate.TYPE, equipmentKey, equipmentTemplate.ATK, equipmentTemplate.DEF,
            equipmentTemplate.MAGIC, username, equipmentTemplate.LEVEL);
        let value = equipmentTemplate.VALUE;

        UserService.spendMoney(username, value).then(result=>{
            if (result){
                return EquipmentDao.save(newEquipment);
            }else{
                reject('余额不足');
            }
        }).then(res=>{
            resolve(res);
        }).catch(err=>{
            reject(err);
        });
    })
};

let equip = function(username, equipmentId){
    return new Promise(function (resolve, reject) {
        let promises = [];
        promises.push(EquipmentDao.findById(equipmentId));
        promises.push(UserDao.findByUsername(username));
        Promise.all(promises).then(results=>{
           let equipment = results[0];
           let user = results[1];
           if ((equipment.username === user.username) && (equipment.level <= user.level)){
               let type = equipment.tp;
               let promise = equipmentHandlers[type];
               if (promise){
                   return promise(username, equipmentId);
               }else{
                   return false;
               }
           }else{
               return false;
           }
        }).then(result=>{
            resolve(result);
        }).catch(err=>{
            reject(err);
        });

    })
};

let equipmentHandlers = {};

equipmentHandlers[EquipmentType.WEAPON] = function(username, equipmentId){
    return new Promise(function (resolve, reject) {
        UserDao.equipWeapon(username, equipmentId).then(result=>{
            resolve(result);
        }).catch(err=>{
            reject(err);
        })
    })
};

equipmentHandlers[EquipmentType.ARMOR] = function(username, equipmentId){
    return new Promise(function (resolve, reject) {
        UserDao.equipArmor(username, equipmentId).then(result=>{
            resolve(result);
        }).catch(err=>{
            reject(err);
        })
    })
};

let strengthen = function(username, equipmentId, key){
    return new Promise(function (resolve, reject) {
        let strengthenConfig;
        EquipmentDao.findById(equipmentId).then(equipment=>{
            let nowStrengthen = equipment.strengthenLevel;
            strengthenConfig = StrenthenConfig[nowStrengthen];
            return UserService.spendMoney(username, strengthenConfig.COST);
        }).then(res=>{
            if (res){
                let addValue = strengthenConfig[key];
                key = key.toLowerCase();
                return EquipmentDao.strengthen(equipmentId, key, addValue);
            }else{
                return false;
            }
        }).then(res=>{
            resolve(res);
        }).catch(err=>{
            reject(err);
        })
    })
};


let findByUsername = function(username){
    return new Promise(function (resolve, reject) {
        EquipmentDao.findByUsername(username).then(result=>{
            resolve(result);
        }).catch(err=>{
            reject(err);
        })
    })
};

exports.getEquipmentListInShop = getEquipmentListInShop;
exports.buyEquipment = buyEquipment;
exports.equip = equip;
exports.strengthen = strengthen;
exports.findByUsername = findByUsername;