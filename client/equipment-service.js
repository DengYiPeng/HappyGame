let client = require("./client-core");
let MsgType = require('../lib/constants/MsgType');

let queryEquipmentList = function (success, fail) {
    let msg = {};
    let params = {};
    msg.type = MsgType.QUERY_EQUIPMENT_LIST;
    msg.params = params;
    client.sendMsg(msg, success, fail);
};

exports.queryEquipmentList = queryEquipmentList;