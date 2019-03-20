/**
 * Created by zp on 16/10/28.
 */
const server = require("../component/connector/connector");
const Constants = require("../constants");
const Conf = require('../config/config');
const _ = require('underscore');



server.events.on('client_data', function (data, socket) {
    try {
        let tmp = data.toString();
        console.log(tmp);
        if (!tmp.type) {
            tmp.type = 0;
        }
        let handle = clientHandler[tmp.type];
        if (tmp.chat && !ChatMap[tmp.chat.type]) {
            socket.send(Common.generateErrorMsg('error chat type'));
            return;
        }
        if (!tmp.requestId){
            tmp.requestId = Common.generateRequestId(socket.userId);
        }
        handle && handle(tmp, socket);
    } catch (e) {
        console.log(e);
    }
});

server.events.on('notify', function (type, info, socket) {//notify client
    let tmp = {type: type, data: info};
    socket.send(proto.encodeC2c(tmp));
});

server.events.on('backend_data', function (userIds, data) {//处理从backend传来的消息
    //去重发消息
    userIds = [...new Set(userIds)];
    let buffer = data;
    //直接通过socket发送消息
    _.each(userIds, function (id) {
        //三端
        let clients = server.getClientsOfUser(id);
        if (clients && Object.keys(clients).length !== 0) {
            _.each(clients, function (v,k) {
                _.each(v.io,function (singleClient) {
                    if (singleClient){
                        singleClient.io && singleClient.io.send(buffer);
                    }
                });
            });
        }
    });
});

server.events.on('notify_other_clients', function (chat) {//转发给该用户的其他客户端
    let clients = server.getClientsOfUser(chat.fromUserId);
    let agent = chat.agent;
    let socketId = chat.socketId;
    let msg = {type: Constants.MSG_TYPE.MSG, chat: chat};
    msg = proto.encodeC2c(msg);
    delete  chat.agent;
    delete  chat.socket;
    Conf.VALID_AGENTS.forEach(function (v) {
        let client = clients[v];
        if (client) {
            _.each(client.io,function (singleClient) {
                //Fixme 过滤发送方
                if (singleClient.socketId !== socketId){
                    singleClient.io.send(msg);
                }
            });
        }
    });
});

server.events.on('client_close', function (userId, agent, token) {
    clientHandlerModule.signOut(userId, agent, token);
});

process.on('uncaughtException', function (err) {
    console.log(err);
});



