/**
 * Created by zp on 16/10/28.
 */
const server = require("../component/connector/connector");
const clientHandlerModule = require('./clientHandler');
const clientHandler = clientHandlerModule.handler;
const logger = require('../util/logger-factory').newLogger('connector');
const MultiUserService  = require('../business/service/multi-user-service');

server.events.on('client_data', function (data, socket) {
    let tmp = data.toString();
    tmp = JSON.parse(tmp);
    logger.info(JSON.stringify(tmp), __info);
    let handle = clientHandler[tmp.type];
    handle && handle(tmp, socket);
});



server.events.on('client_close', function (username) {
    MultiUserService.deleteUserInfo(username);
});

process.on('uncaughtException', function (err) {
    console.log(err);
});



