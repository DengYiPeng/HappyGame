/**
 * Created by gbc on 17/12/1.
 */
const MsgType = require('../constants/MsgType');

const UserService = require('../business/service/user-service');
const EquipmentService = require('../business/service/equipment-service');
const logger = require('../util/logger-factory').newLogger('connector-clientHandler');
const SimpleResponse = require('../form/SimpleResponse');

let clientHandler = {};

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

clientHandler[MsgType.QUERY_EQUIPMENT_LIST] = function(msg, socket){
    let requestId = msg.requestId;
    EquipmentService.getEquipmentListInShop().then(result=>{
        socket.send(SimpleResponse.OK(requestId, result));
    }).catch(err=>{
        socket.send(SimpleResponse.ERROR(requestId, err));
    })
};


exports.handler = clientHandler;
