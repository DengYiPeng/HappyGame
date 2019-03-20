/**
 * Created by zp on 16/10/11.
 */
const constants = require("../../constants");
const Conf = require('../../config/config');
const _ = require('underscore');
const events = require("events");
const ConnectorSocket = require("./connector-socket");
const logger = require('../../util/logger-factory').newLogger('connector');
const port = Conf.CONNECTOR.PORT;
const host = Conf.APPLICATION.ip;
const io = new ConnectorSocket(port, Conf.APPLICATION.local_ip);
const eventEmitter = new events.EventEmitter();

logger.info("在" + Conf.APPLICATION.local_ip + ":" +port+"开启了服务器端口", __info);
const clientSockets = new Map();

module.exports.addClient = function (client, token) {
    const addr = client.address;
    let info = client.info;

    return true;
};

//client socket connect to connector
io.on('connection', function (socket) {
    socket.count = 0;
    setTimeout(function () {//if 5s not sign,close
        if (socket && !socket.userId) {
            logger.info("[socket force close] client connection timeout", __info);
            socket.close();
            socket = null;
        }
    }, Conf.TIME.SERVER_CONNECTION_TIMEOUT);

    socket.on("message", function (data) {
        socket.count++;
        socket.time = new Date().getTime();
        if (data.length > Conf.MAX_DATA_LENGTH) {
            logger.info("[socket force close] data length to large", __info);
            socket.close();
            socket = null;
            logger.error(socket.userId + " send data length " + data.length, __info);
        }
        eventEmitter.emit("client_data", data, socket);
    });

    let handleClose = function () {
        if (!socket) return;

        console.log(socket.userId + ' 的' + agent + ' 端的' + socket.socketId + "断开了");
        socket = null;
    };

    socket.on('close', handleClose);
    socket.on("error", function (err) {
        logger.info("[socket force close] client socket err", __info);
        handleClose();
    });
});





const cachingRequests = new Map();
const bindRequestHandler = function (requestId, msg) {
    if (!requestId) {
        return null;
    }
    const cache = {};
    const promise = new Promise(function (resolve, reject) {
        cache.resolve = resolve;
        cache.reject = reject;
        cache.time = new Date().getTime();
        msg && (cache.chat = msg);
    });
    cache.promise = promise;
    cachingRequests.set(requestId, cache);
    return promise;
};

setInterval(function () {//clear timeout request
    const now = new Date().getTime();
    cachingRequests.forEach(function (cache, id) {
        if (now - cache.time > Conf.TIME.REQUEST_TIMEOUT) {
            cachingRequests.delete(id);
            cache.reject('request timeout');
        }
    });
}, Conf.TIME.REQUEST_TIMEOUT);




function clearClient() {

}


setInterval(function () {
    clearClient();
}, Conf.TIME.CLEAR_CLIENT_TIME);



module.exports.events = eventEmitter;

exports.getHost = function () {
    return host;
};
exports.getPort = function () {
    return port;
};








