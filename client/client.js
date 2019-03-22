const ClientCore = require('./client-core');
const UserService = require('./user-service');
const EquipmentService = require('./equipment-service');


exports.signIn = ClientCore.init;
exports.markPosition = UserService.markPosition;
exports.queryEquipmentListInShop = EquipmentService.queryEquipmentList;
exports.buyEquipment = EquipmentService.buyEquipment;