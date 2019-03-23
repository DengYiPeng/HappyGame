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

let getUserStatus = function(success, fail){
    let msg = {};
    let params ={};
    msg.type = MsgType.USER_STATUS;
    msg.params = params;
    client.sendMsg(msg, success, fail);
};

let getUserLevelInfo = function(success, fail){
    let msg = {};
    let params ={};
    msg.type = MsgType.USER_LEVEL_INFO;
    msg.params = params;
    client.sendMsg(msg, success, fail);
};

let levelUp = function(success, fail){
    let msg = {};
    let params ={};
    msg.type = MsgType.LEVEL_UP;
    msg.params = params;
    client.sendMsg(msg, success, fail);
};

let allocPotential = function(magic, atk, def, hp, mp, success, fail){
    let msg = {};
    let params = {};
    params.magic = magic;
    params.atk = atk;
    params.def = def;
    params.hp = hp;
    params.mp = mp;
    msg.params = params;
    msg.type = MsgType.ALLOC_POTENTIAL;
    client.sendMsg(msg, success, fail);
};

exports.markPosition = markPosition;
exports.heal = heal;
exports.getUserStatus = getUserStatus;
exports.getUserLevelInfo = getUserLevelInfo;
exports.levelUp = levelUp;
exports.allocPotential = allocPotential;
