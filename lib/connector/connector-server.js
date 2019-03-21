/**
 * Created by zp on 16/10/28.
 */
const server = require("../component/connector/connector");
const Constants = require("../constants");
const Conf = require('../config/config');
const _ = require('underscore');
const clientHandlerModule = require('./clientHandler');
const clientHandler = clientHandlerModule.handler;
const logger = require('../util/logger-factory').newLogger('connector');


server.events.on('client_data', function (data, socket) {
    let tmp = data.toString();
    logger.info(tmp, __info);
    let handle = clientHandler[tmp.type];
    handle && handle(tmp, socket);
});





process.on('uncaughtException', function (err) {
    console.log(err);
});



