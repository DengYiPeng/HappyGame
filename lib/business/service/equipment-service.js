const EquipmentModel = require('../model/equipment-model');
const EquipmentDao = require('../dao/equipment-dao');
const EquipmentConfig = require('../../config/equipment-config');
const UserService = require('../service/user-service');

let getEquipmentListInShop = function () {
    return new Promise(function (resolve, reject) {
        resolve(EquipmentConfig);
    })
};

let buyEquipment = function(username, equipmentKey){
    return new Promise(function (resolve, reject) {
        let equipmentTemplate = EquipmentConfig[equipmentKey];
        equipmentTemplate.ATK && (equipmentTemplate.ATK = 0);
        equipmentTemplate.DEF && (equipmentTemplate.DEF = 0);
        equipmentTemplate.MAGIC && (equipmentTemplate.MAGIC = 0);
        
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


exports.getEquipmentListInShop = getEquipmentListInShop;
exports.buyEquipment = buyEquipment;