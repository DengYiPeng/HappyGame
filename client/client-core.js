const io = require("engine.io-client");
const Common = require('../lib/util/common');
const MsgType = require('../lib/constants/MsgType');
const ResponseCode = require('../lib/constants/ResponseCode');
let cachingRequests = new Map();
let _socket ;
let _username = '';


/**
 * 将请求绑定回调
 * @param requestId 请求id
 * @param success 请求成功
 * @param fail 请求失败
 * @param note 标识请求，调试使用
 * @returns {null}
 */
let bindRequestHandler = function (requestId, success, fail, note) {
    if (!requestId) {
        return null;
    }
    let cache = {};
    cache.resolve = success;
    cache.reject = fail;

    setTimeout(function () {
        let c = cachingRequests.get(requestId);
        if (c) {
            c.reject(note + ' timeout requestId:'+requestId);
            delete cachingRequests.delete(requestId);
        }
    }, 2000);

    cachingRequests.set(requestId, cache);
};

function init(address, username, res, rej) {
    _username = username;

    _socket = new io("http://"+address, {
        transports:['websocket','polling'],
        rejectUnauthorized:false,
    });

    _socket.on("open", function () {
        let requestId = Common.generateRequestId(username);
        let params = {username: username};
        let sign = {type: MsgType.START, params: params, requestId: requestId};
        _socket.send(new Buffer(JSON.stringify(sign)));
        bindRequestHandler(requestId, res, rej,"sign");
    });

    _socket.on("message", function (data) {
        let msg = data.toString();
        msg = JSON.parse(msg);
        let requestId = msg.requestId;
        let cache = cachingRequests.get(requestId);
        cachingRequests.delete(requestId);
        if (msg.code === ResponseCode.OK){
            cache.resolve(msg.data);
        }else{
            cache.reject(msg.data);
        }
    });

    _socket.on('close', function (data) {
        console.log('socket close reason: ',data);
        _username = '';
    });

}

exports.sendMsg= function (msg, success, fail) {
    let requestId = Common.generateRequestId(_username);
    msg.requestId = requestId;
    _socket.send(new Buffer(JSON.stringify(msg)));
    bindRequestHandler(requestId, function (result) {//绑定返回值
        success&&success(result);
    }, function (err) {
        fail&&fail(err);
        console.log(err);
    }, 'send msg');

};

exports.init = init;
