/**
 * Created by gbc on 17/12/1.
 */
const Constants = require("../constants");
const _ = require('underscore');
const logger = require('../util/logger-factory').newLogger('connector-clientHandler');


let clientHandler = {};


let guid = function() {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
};


let handleBusiness = function handleBusiness(requestId, buffer, hashKey){
    return new Promise(function (resolve, reject) {
        connectorServer.sendBusinessToBackend(requestId, buffer, hashKey).then(function (successMsg) {//转发
            successMsg.data = JSON.parse(successMsg.data.toString());
            resolve(successMsg);
        }, function (errMsg) {
            errMsg.data = JSON.parse(errMsg.data.toString());
            resolve(errMsg);
        });
    });
};


let addClient = function(msg, socket){
    socket.info = JSON.parse(msg.params);
    socket.socketId = guid();
    socket.userStr = Common.longToString(parseInt(socket.info.userId)) + '$';
    let token = socket.info.token;
    let res = connectorServer.addClient(socket, token);
    return res;
};


let signOut = function(userId, agent, token){
    let requestId = Common.generateRequestId(-1);
    let msg = {};
    msg.type = Constants.MSG_TYPE.BUSINESS;
    msg.requestId = requestId;
    msg.data = JSON.stringify({type:Constants.BUSINESS_TYPE.SIGN_OUT, userId:userId, agent:agent, token:token});
    let buffer = proto.encodeC2c(msg);
    //Fixme 这里通过userId来进行hash不知道有没有问题
    handleBusiness(requestId, buffer, userId).then(result=>{
        //感觉这里好像不用做啥
    })
};


clientHandler[Constants.MSG_TYPE.BUSINESS] = function(msg, socket) {
    let buffer = proto.encodeC2c(msg);
    let requestId = msg.requestId;
    let data = JSON.parse(msg.data);
    let hashKey = Common.getBackendHashKeyByKey(data._key);
    handleBusiness(requestId, buffer, hashKey).then(result=>{
        let rsp = C2CResponseUtil.generateC2CResponse(result);
        socket.send(proto.encodeC2c(rsp));
    })
};


clientHandler[Constants.MSG_TYPE.SIGN_IN] = function (data, socket) {
    console.log(JSON.stringify(data));
};

clientHandler[Constants.MSG_TYPE.MARK_READ_TIME] = function (msg, socket) {
    HappyLogger.log('clientHandler:Mark_READ_TIME', JSON.stringify(msg));
    let params = msg.chat;
    let groupId = params.groupId;
    let key;
    if (groupId){
        key = Common.generateKeyByGroupId(groupId);
    }else{
        key = Common.generateKeyByAffairIdAndRoleId(params.affairId, params.fromRoleId, params.toRoleId);
    }
    msg.chat.fromUserId = socket.userId || params.fromUserId;
    msg.data = JSON.stringify({type:Constants.BUSINESS_TYPE.MARK_READ});
    let buffer = proto.encodeC2c(msg);
    let requestId = msg.requestId;
    let hashKey = Common.getBackendHashKeyByKey(key);
    handleBusiness(requestId, buffer, hashKey).then(result=>{
        let rsp = C2CResponseUtil.generateC2CResponse(result);
        socket.send(proto.encodeC2c(rsp));
    });
};


//查询时需要检查是不是在同一个事务内，防止信息泄露，如果是查看其他人的东西，则需要授权
clientHandler[Constants.MSG_TYPE.ROOM_MSG_QUERY] = function (msg, socket) {
    HappyLogger.log('clientHandler:ROOM_MSG_QUERY', JSON.stringify(msg));
    let session = msg.chat;
    msg.chat.fromUserId = socket.userId;
    let key = Common.generateKey(session);
    msg.data = JSON.stringify({type:Constants.BUSINESS_TYPE.QUERY_MSG});
    let buffer = proto.encodeC2c(msg);
    let requestId = msg.requestId;
    let hashKey = Common.getBackendHashKeyByKey(key);
    handleBusiness(requestId, buffer, hashKey).then(result=>{
        let rsp = C2CResponseUtil.generateC2CResponse(result);
        rsp.key = key;
        if (rsp.type = Constants.MSG_TYPE.RESPONSE){
            rsp.msgList = JSON.parse(rsp.data);
            rsp.data = JSON.stringify({count:rsp.msgList.length})
        }
        socket.send(proto.encodeC2c(rsp));
    });
};

clientHandler[Constants.MSG_TYPE.GET_UNREAD_COUNT] = function (msg, socket) {//查询时需要检查是不是在同一个事务内
    let key = msg.chat._key;
    msg.chat.fromUserId = socket.userId;
    let buffer = proto.encodeC2c(msg);
    let requestId = msg.requestId;
    let hashKey = Common.getBackendHashKeyByKey(key);
    handleBusiness(requestId, buffer, hashKey).then(result=>{
        let rsp = C2CResponseUtil.generateC2CResponse(result);
        socket.send(proto.encodeC2c(rsp));
    })
};



clientHandler[Constants.MSG_TYPE.MSG] = function (msg, socket) {//收到消息时
    let chatMsg = msg.chat;
    var tmp = {};

    chatMsg = fillImageMsg(chatMsg);
    chatMsg.fromUserId = socket.userId;
    //暂时把apns屏蔽
    var needs = ChatMap[chatMsg.type].needs;
    for (let i = 0; i < needs.length; i++) {//检查消息是否合法
        const k = chatMsg[needs[i]];
        if (k !== undefined) {
            tmp[needs[i]] = k;
        } else {
            socket.send(Common.generateErrorMsg('need ' + needs[i], msg.requestId));
            return;
        }
    }
    if (!chatMsg.sub) {
        tmp.sub = 0
    } else {
        tmp.sub = chatMsg.sub;
    }
    tmp.apns = chatMsg.apns ? chatMsg.apns : "[]";
    chatMsg.options&&(tmp.options = chatMsg.options);
    chatMsg.affairId && (tmp.affairId = chatMsg.affairId);
    chatMsg.state = 0;

    if (!msg.requestId || msg.requestId.indexOf(socket.userStr) < 0) {//防止requestId混淆
        socket.send(Common.generateErrorMsg('error requestId', msg.requestId));
        return;
    }
    let newMsg = {type: msg.type, chat: tmp, requestId: msg.requestId};
    var buffer = proto.encodeC2c(newMsg);
    var hashKey = ChatMap[chatMsg.type].hash.call(this, chatMsg);
    tmp.agent = socket.info.agent;
    tmp.socketId = socket.socketId;
    connectorServer.relayToBackend(msg.requestId, buffer, hashKey, tmp).then(function (msg) {//转发
        let chat = {time: msg.time, index: msg.index};
        let rsp = {type: Constants.MSG_TYPE.RESPONSE, requestId: msg.requestId, chat: chat};
        socket.send(proto.encodeC2c(rsp));
    }, function (err) {
        logger.error(err, __info);
        let errMsg = Common.generateErrorMsg(err, msg.requestId);
        socket.send(errMsg);
    });
};

let convertSuffixToExt = function(suffix){
    if (suffix === 'jpg' || suffix === 'jpeg'){
        return 'jpeg';
    }
    return suffix;
};

let fillImageMsg = function(msg){
    if (msg.sub === Constants.CHAT_SUBTYPE.IMAGE){
        let content = msg.content;
        content = JSON.parse(content);
        let url = content.url;
        let splitResults = url.split('/');
        let name = splitResults[splitResults.length-1];
        let nameSplitResults = name.split('.');
        let suffix = nameSplitResults[nameSplitResults.length-1];
        let ext  = 'image/' + convertSuffixToExt(suffix);
        content.name = name;
        content.ext = ext;
        msg.content = JSON.stringify(content);
    }
    return msg;
};

clientHandler[Constants.MSG_TYPE.PING] = function (msg, socket) {
    let pong = {type: Constants.MSG_TYPE.PONG, data: connectorServer.getHost() + ':' + connectorServer.getPort()};
    if (!socket.userId || !socket.socketId) return;
    let clients = connectorServer.getClientsOfUser(socket.userId);
    let hasClient = false;
    if (clients && Object.keys(clients).length !== 0) {
        _.each(clients, function (v,k) {
            _.each(v.io,function (singleClient) {
                if (singleClient){
                    hasClient = hasClient || (socket.socketId === singleClient.socketId);
                }
            });
        });
    }
    if (!hasClient) return;
    socket.send(proto.encodeC2c(pong));
};

clientHandler[Constants.MSG_TYPE.STATUS] = function (msg, socket) {
    let tmp = connectorServer.getClientsOfUser(socket.userId);
    let info = {};
    tmp.Web && tmp.Web.io.length >0 &&(info.Web = tmp.Web.io[0].time);
    tmp.Android && tmp.Android.io.length>0 && (info.Android = tmp.Android.io[0].time);
    tmp.iOS && tmp.iOS.io.length > 0&&(info.iOS = tmp.iOS.io[0].time);
    let rsp = {type: Constants.MSG_TYPE.RESPONSE, requestId: msg.requestId, data: JSON.stringify(info)};
    socket.send(proto.encodeC2c(rsp));
};





exports.signOut = signOut;


exports.handler = clientHandler;
