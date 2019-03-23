let client = require("./client-core");
let MsgType = require('../lib/constants/MsgType');

let markPosition = function (mapId, xAxis, yAxis, success, fail) {
    let msg = {};
    let params = {mapId:mapId, xAxis:xAxis, yAxis:yAxis};
    msg.type = MsgType.MARK_POSITION;
    msg.params = params;
    client.sendMsg(msg, success, fail);
};

let heal = function(success ,fail){
    let msg = {};
    let params = {};
    msg.type = MsgType.HEAL;
    msg.params = params;
    client.sendMsg(msg, success, fail);
};

exports.markPosition = markPosition;
exports.heal = heal;