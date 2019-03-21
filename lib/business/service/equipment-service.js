const EquipmentModel = require('../model/equipment-model');
const EquipmentDao = require('../dao/equipment-dao');
const EquipmentConfig = require('../../config/equipment-config');


let getEquipmentListInShop = function () {
    return new Promise(function (resolve, reject) {
        let config = EquipmentConfig;
        resolve(config);
    })
};


exports.getEquipmentListInShop = getEquipmentListInShop;