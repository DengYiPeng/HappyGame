/**
 * Created by gbc on 17/12/1.
 */
const MsgType = require('../constants/MsgType');

const UserService = require('../business/service/user-service');
const EquipmentService = require('../business/service/equipment-service');
const SkillService = require('../business/service/skill-service');
const FightService = require('../business/service/fight-service');
const MultiUserService = require('../business/service/multi-user-service');
const logger = require('../util/logger-factory').newLogger('connector-clientHandler');
const SimpleResponse = require('../form/SimpleResponse');

let clientHandler = {};

clientHandler[MsgType.START] = function(msg, socket){
    let requestId = msg.requestId;
    let params = msg.params;
    let username = params.username;
    UserService.getUserInfo(username, socket).then(result=>{
        socket.username = username;
        socket.send(SimpleResponse.OK(requestId, result));
    }).catch(err=>{
        socket.send(SimpleResponse.ERROR(requestId, err));
    })
};

clientHandler[MsgType.USER_STATUS] = function(msg, socket){
    let requestId = msg.requestId;
    let username = socket.username;
    UserService.getUserInfo(username, socket).then(result=>{
        socket.send(SimpleResponse.OK(requestId, result));
    }).catch(err=>{
        socket.send(SimpleResponse.ERROR(requestId, err));
    })
};

clientHandler[MsgType.MARK_POSITION] = function(msg, socket){
    let requestId = msg.requestId;
    let params = msg.params;
    let username = socket.username;
    let mapId = params.mapId;
    let xAxis = params.xAxis;
    let yAxis = params.yAxis;
    let monsterType = params.monsterType;
    UserService.markUserPosition(username, mapId, xAxis, yAxis, monsterType, socket).then(result=>{
        socket.send(SimpleResponse.OK(requestId, result));
    }).catch(err=>{
        socket.send(SimpleResponse.ERROR(requestId, err));
    })
};


clientHandler[MsgType.HEAL] = function(msg, socket){
    let requestId = msg.requestId;
    let username = socket.username;
    UserService.heal(username).then(result=>{
        socket.send(SimpleResponse.OK(requestId, result));
    }).catch(err=>{
        socket.send(SimpleResponse.ERROR(requestId, err));
    })
};

clientHandler[MsgType.USER_LEVEL_INFO] = function(msg, socket){
    let requestId = msg.requestId;
    UserService.getLevelInfo().then(result=>{
        socket.send(SimpleResponse.OK(requestId, result));
    }).catch(err=>{
        socket.send(SimpleResponse.ERROR(requestId, err));
    })
};

clientHandler[MsgType.LEVEL_UP] = function(msg, socket){
    let requestId = msg.requestId;
    let username = socket.username;
    UserService.levelUp(username).then(result=>{
        socket.send(SimpleResponse.OK(requestId, result));
    }).catch(err=>{
        socket.send(SimpleResponse.ERROR(requestId, err));
    })
};

clientHandler[MsgType.INIT_ROLE_TYPE] = function(msg, socket){
    let requestId = msg.requestId;
    let params = msg.params;
    let roleType = params.roleType;
    let username = socket.username;
    UserService.initRoleType(username, roleType).then(result=>{
        socket.send(SimpleResponse.OK(requestId, result));
    }).catch(err=>{
        socket.send(SimpleResponse.ERROR(requestId, err));
    })
};

clientHandler[MsgType.QUERY_HEAL_CONFIG] = function(msg, socket){
    let requestId = msg.requestId;
    UserService.getHealConfig().then(result=>{
        socket.send(SimpleResponse.OK(requestId, result));
    }).catch(err=>{
        socket.send(SimpleResponse.ERROR(requestId, err));
    })
};

clientHandler[MsgType.QUERY_ROLE_TYPE_CONFIG] = function(msg, socket){
    let requestId = msg.requestId;
    UserService.getRoleTypeConfig().then(result=>{
        socket.send(SimpleResponse.OK(requestId, result));
    }).catch(err=>{
        socket.send(SimpleResponse.ERROR(requestId, err));
    })
};

clientHandler[MsgType.ALLOC_POTENTIAL] = function(msg, socket){
    let requestId = msg.requestId;
    let username = socket.username;
    let params = msg.params;
    let magic = params.magic;
    let atk = params.atk;
    let def = params.def;
    let hp = params.hp;
    let mp = params.mp;
    UserService.allocPotential(username, magic, atk, def, hp, mp).then(result=>{
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

clientHandler[MsgType.BUY_EQUIPMENT] = function(msg, socket){
    let requestId = msg.requestId;
    let params = msg.params;
    let username = socket.username;
    let equipmentKey = params.equipmentKey;
    EquipmentService.buyEquipment(username, equipmentKey).then(result=>{
        socket.send(SimpleResponse.OK(requestId, result));
    }).catch(err=>{
        socket.send(SimpleResponse.ERROR(requestId, err));
    })
};

clientHandler[MsgType.EQUIP] = function(msg, socket){
    let requestId = msg.requestId;
    let params = msg.params;
    let username = socket.username;
    let equipmentId = params.equipmentId;
    EquipmentService.equip(username, equipmentId).then(result=>{
        socket.send(SimpleResponse.OK(requestId, result));
    }).catch(err=>{
        socket.send(SimpleResponse.ERROR(requestId, err));
    })
};

clientHandler[MsgType.STRENGTHEN] = function(msg, socket){
    let requestId = msg.requestId;
    let params = msg.params;
    let username = socket.username;
    let equipmentId = params.equipmentId;
    let key = params.key;
    EquipmentService.strengthen(username, equipmentId, key).then(result=>{
        socket.send(SimpleResponse.OK(requestId, result));
    }).catch(err=>{
        socket.send(SimpleResponse.ERROR(requestId, err));
    })
};

clientHandler[MsgType.GET_EQUIPMENT_IN_BAG] = function(msg, socket){
    let requestId = msg.requestId;
    let username = socket.username;
    EquipmentService.findByUsername(username).then(result=>{
        socket.send(SimpleResponse.OK(requestId, result));
    }).catch(err=>{
        socket.send(SimpleResponse.ERROR(requestId, err));
    })
};



clientHandler[MsgType.GET_EQUIPMENT_IN_BAG] = function(msg, socket){
    let requestId = msg.requestId;
    let username = socket.username;
    EquipmentService.findByUsername(username).then(result=>{
        socket.send(SimpleResponse.OK(requestId, result));
    }).catch(err=>{
        socket.send(SimpleResponse.ERROR(requestId, err));
    })
};

clientHandler[MsgType.QUERY_SKILL_LIST] = function(msg, socket){
    let requestId = msg.requestId;
    SkillService.getSkillConfig().then(result=>{
        socket.send(SimpleResponse.OK(requestId, result));
    }).catch(err=>{
        socket.send(SimpleResponse.ERROR(requestId, err));
    })
};

clientHandler[MsgType.QUERY_UPSKILL_CONFIG] = function(msg, socket){
    let requestId = msg.requestId;
    SkillService.getUpskillConfig().then(result=>{
        socket.send(SimpleResponse.OK(requestId, result));
    }).catch(err=>{
        socket.send(SimpleResponse.ERROR(requestId, err));
    })
};

clientHandler[MsgType.UPSKILL] = function(msg, socket){
    let requestId = msg.requestId;
    let username = socket.username;
    let params = msg.params;
    let key = params.key;
    SkillService.upskill(username, key).then(result=>{
        socket.send(SimpleResponse.OK(requestId, result));
    }).catch(err=>{
        socket.send(SimpleResponse.ERROR(requestId, err));
    })
};


clientHandler[MsgType.FIGHT] = function(msg, socket){
    let requestId = msg.requestId;
    let username = socket.username;
    let params = msg.params;
    let targetId = params.targetId;
    let skillKey = params.skillKey;
    FightService.fight(username, skillKey, targetId, socket).then(result=>{
        socket.send(SimpleResponse.OK(requestId, result));
    }).catch(err=>{
        socket.send(SimpleResponse.ERROR(requestId, err));
    })
};

clientHandler[MsgType.QUERY_OTHER_USER_INFO] = function(msg, socket){
    let requestId = msg.requestId;
    let username = socket.username;
    let params = msg.params;
    let mapIndex= params.mapIndex;
    MultiUserService.getUserInfoInMap(mapIndex).then(result=>{
        socket.send(SimpleResponse.OK(requestId, result));
    }).catch(err=>{
        socket.send(SimpleResponse.ERROR(requestId, err));
    })
};

clientHandler[MsgType.QUERY_STRENGTHEN_CONFIG] = function(msg, socket){
    let requestId = msg.requestId;
    EquipmentService.queryStrengthenConfig().then(result=>{
        socket.send(SimpleResponse.OK(requestId, result));
    }).catch(err=>{
        socket.send(SimpleResponse.ERROR(requestId, err));
    })
};

exports.handler = clientHandler;
