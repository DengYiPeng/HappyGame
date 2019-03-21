/**
 * Created by zp on 16/10/11.
 */
const Conf = require('../../config/config');
const _ = require('underscore');
const events = require("events");
const ConnectorSocket = require("./connector-socket");
const logger = require('../../util/logger-factory').newLogger('connector');
const port = Conf.CONNECTOR.PORT;
const io = new ConnectorSocket(port, Conf.APPLICATION.local_ip);
const eventEmitter = new events.EventEmitter();

logger.info("在" + Conf.APPLICATION.local_ip + ":" +port+"开启了服务器端口", __info);



//client socket connect to connector
io.on('connection', function (socket) {
    //注册socket timer,规定时间内登录失败则清除socket

    let signTimer = function () {
        setTimeout(function () {//if 5s not sign,close
            if (socket && !socket.username) {
                logger.info("[socket force close] client connection timeout", __info);
                socket.close();
                socket = null;
            }
        }, Conf.TIME.SERVER_CONNECTION_TIMEOUT);
    };

    let messageHandler = function (data) {
        if (data.length > Conf.MAX_DATA_LENGTH) {
            logger.info("[socket force close] data length to large", __info);
            socket.close();
            socket = null;
            logger.error(socket.userId + " send data length " + data.length, __info);
        }
        eventEmitter.emit("client_data", data, socket);
    };

    let closeHandler = function () {
        if (!socket) return;
        socket.close();
        socket = null;
    };

    let errHandler = function () {
        logger.info("[socket force close] client socket err", __info);
        closeHandler(socket);
    };

    signTimer();
    socket.on("message", messageHandler);
    socket.on('close', closeHandler);
    socket.on("error", errHandler);

});










function clearClient() {

}


setInterval(function () {
    clearClient();
}, Conf.TIME.CLEAR_CLIENT_TIME);



module.exports.events = eventEmitter;










