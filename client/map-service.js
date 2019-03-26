let client = require("./client-core");
let MsgType = require('../lib/constants/MsgType');

let queryOtherUserInfo = function (mapIndex,success, fail) {
    let msg = {};
    let params = {mapIndex:mapIndex};
    msg.type = MsgType.QUERY_OTHER_USER_INFO;
    msg.params = params;
    client.sendMsg(msg, success, fail);
};

exports.queryOtherUserInfo = queryOtherUserInfo;