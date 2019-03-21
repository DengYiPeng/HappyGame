/**
 * Created by gbc on 17/12/1.
 */
const MsgType = require('../constants/MsgType');

const UserService = require('../business/service/user-service');
const logger = require('../util/logger-factory').newLogger('connector-clientHandler');
const SimpleResponse = require('../form/SimpleResponse');

let clientHandler = {};


let guid = function() {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
};


clientHandler[MsgType.START] = function(msg, socket){
    let requestId = msg.requestId;
    let params = msg.params;
    let username = params.username;
    UserService.getUserInfo(username).then(result=>{
        socket.username = username;
        socket.send(SimpleResponse.OK(requestId, result));
    }).catch(err=>{
        socket.send(SimpleResponse.ERROR(requestId, err));
    })
};



exports.handler = clientHandler;
