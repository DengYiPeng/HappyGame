let client = require("./client-core");
let MsgType = require('../lib/constants/MsgType');

let fight = function (skillKey, targetId, success, fail) {
    let msg = {};
    let params = {skillKey:skillKey, targetId:targetId};
    msg.type = MsgType.FIGHT;
    msg.params = params;
    client.sendMsg(msg, success, fail);
};

exports.fight = fight;