let client = require("./client-core");
let MsgType = require('../lib/constants/MsgType');

let queryEquipmentList = function (success, fail) {
    let msg = {};
    let params = {};
    msg.type = MsgType.QUERY_EQUIPMENT_LIST;
    msg.params = params;
    client.sendMsg(msg, success, fail);
};

let buyEquipment = function (equipmentKey, success, fail){
    let msg = {};
    let params = {equipmentKey:equipmentKey};
    msg.type = MsgType.BUY_EQUIPMENT;
    msg.params = params;
    client.sendMsg(msg, success, fail);
};

let equip = function(equipmentId, success, fail){
    let msg = {};
    let params = {equipmentId:equipmentId};
    msg.type = MsgType.EQUIP;
    msg.params = params;
    client.sendMsg(msg, success, fail);
};

let strengthen = function(equipmentId, key, success, fail){
    let msg = {};
    let params = {equipmentId:equipmentId, key:key};
    msg.type = MsgType.STRENGTHEN;
    msg.params = params;
    client.sendMsg(msg, success, fail);
};

let getEquipmentByUsername = function(success, fail){
    let msg = {};
    let params = {};
    msg.type = MsgType.GET_EQUIPMENT_IN_BAG;
    msg.params = params;
    client.sendMsg(msg, success, fail);
};

exports.queryEquipmentList = queryEquipmentList;
exports.buyEquipment = buyEquipment;
exports.equip = equip;
exports.strengthen = strengthen;
exports.getEquipmentByUsername = getEquipmentByUsername;