const io = require("engine.io-client");
const Constants = require('../lib/constants');
const Common = require('../lib/util/common');

let _handlers = {};
let cachingRequests = new Map();
let _socket ;


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

let isValidHandler = function(handler) {
    if (typeof handler === 'function' || handler instanceof RegExp) {
        return true
    } else if (handler && typeof handler === 'object') {
        return isValidHandler(handler.handler)
    } else {
        return false
    }
};

let indexOfHandlers = function(handlers, handler) {
    if(handlers){
        let i = handlers.length;
        while (i--) {
            if (handlers[i].handler === handler) {
                return i;
            }
        }
    }
    return -1;
};

let addHandler = function (key, handler) {
    if (!isValidHandler(handler)) {
        throw new TypeError('handler must be a function');
    }

    let handlers = _handlers[key];
    let listenerIsWrapped = typeof handler === 'object';

    if (indexOfHandlers(handlers, handler) === -1) {
        if(!_handlers[key]){
            _handlers[key] = [];
        }
        _handlers[key].push(listenerIsWrapped ? handler : {
            handler: handler,
            once: false
        });
    }
    return this;
};

let addOnceHandler = function (key, handler) {
    return addHandler(key, {
        handler: handler,
        once: true
    });
};

let removeHandler = function (key, handler) {
    let handlers = _handlers[key];
    let index;

    index = indexOfHandlers(handlers, handler);
    if (index !== -1) {
        handlers.splice(index, 1);
    }

    return this;
};

let execHandlers = function (key, args) {
    let handlers = _handlers[key];
    if(handlers){
        let index = handlers.length;
        while (index--){
            handlers[index].handler && handlers[index].handler.apply(this, args);
            if(handlers[index].once === true){
                removeHandler(key, handlers[index].handler);
            }
        }
    }
};

function init(address, username, password, handlers) {
    handlers || (handlers = {});
    for (let key in handlers){
        if (handlers.hasOwnProperty(key)) {
            for(let index in handlers[key]){
                addHandler(key, handlers[key][index]);
            }
        }
    }


    _socket = new io("http://"+address, {
        transports:['websocket','polling'],
        rejectUnauthorized:false,
    });
    _socket.binaryType = "arraybuffer";

    _socket.on("open", function () {
        let requestId = Common.generateRequestId(username);
        let params = {username: username, password:password};
        let sign = {type: Constants.MSG_TYPE.SIGN_IN, params: JSON.stringify(params), requestId: requestId};
        _socket.send(new Buffer(JSON.stringify(sign)));
        bindRequestHandler(requestId, signCallBackWithSuccess, signCallBackWithError,"sign");
    });

    _socket.on("message", function (data) {
        console.log(data.toString());
    });

    _socket.on('close', function (data) {
        console.log('socket close reason: ',data);
    });

    let signCallBackWithSuccess = function (data) {
        execHandlers('SIGN_CALLBACK', [data]);
        console.log("signed to " + address);
    };

    let signCallBackWithError = function (err) {
        console.error(err);
    };

}

exports.init = init;
