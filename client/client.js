const ClientCore = require('./client-core');
const UserService = require('./user-service');
const EquipmentService = require('./equipment-service');


exports.signIn = ClientCore.init;
exports.getUserStatus = UserService.getUserStatus;
exports.markPosition = UserService.markPosition;
exports.heal = UserService.heal;
exports.getUserLevelInfo = UserService.getUserLevelInfo;
exports.queryEquipmentListInShop = EquipmentService.queryEquipmentList;
exports.buyEquipment = EquipmentService.buyEquipment;