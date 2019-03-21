const ClientCore = require('./client-core');
const UserService = require('./user-service');
const EquipmentService = require('./equipment-service');


exports.signIn = ClientCore.init;
exports.queryEquipmentListInShop = EquipmentService.queryEquipmentList;