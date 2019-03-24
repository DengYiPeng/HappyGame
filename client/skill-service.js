let client = require("./client-core");
let MsgType = require('../lib/constants/MsgType');

let querySkillList = function (success, fail) {
    let msg = {};
    let params = {};
    msg.type = MsgType.QUERY_SKILL_LIST;
    msg.params = params;
    client.sendMsg(msg, success, fail);
};


let queryUpskillConfig = function (success, fail) {
    let msg = {};
    let params = {};
    msg.type = MsgType.QUERY_UPSKILL_CONFIG;
    msg.params = params;
    client.sendMsg(msg, success, fail);
};

let upSkill = function(key, success, fail){
    let msg = {};
    let params = {};
    params.key = key;
    msg.type = MsgType.UPSKILL;
    msg.params = params;
    client.sendMsg(msg, success, fail);
};

exports.querySkillList = querySkillList;
exports.queryUpskillConfig = queryUpskillConfig;
exports.upSkill = upSkill;