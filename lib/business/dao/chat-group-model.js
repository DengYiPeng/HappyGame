/**
 * Created by zp on 16/10/21.
 */
const mongoose = require('mongoose'), Conf = require('../../config/config'),Promise = require('promise');
require('mongoose-long')(mongoose);
const SchemaTypes = mongoose.Schema.Types;
const conn =mongoose.createConnection(Conf.MONGO.URL+Conf.MONGO.DB1); //连接mongodb数据库
const logger = require('../../util/logger-factory').newLogger('chatGroup');
const Schema = mongoose.Schema;



const ChatGroupMemberSchema = new Schema({
    roleId:SchemaTypes.Long,
    affairId:SchemaTypes.Long,
    type:Number,
    state:Number,
    _id:false
});

const ChatGroupSchema = new Schema({
    _id : Number,
    name : String,
    state : Number,
    type : Number,
    topicType : Number,
    topicId : SchemaTypes.Long,
    ownerRoleId : SchemaTypes.Long,
    resourceId : SchemaTypes.Long,
    affairId : SchemaTypes.Long,
    avatar : String,
    members : [ChatGroupMemberSchema],
    tempMembers:[SchemaTypes.Long],
    createTime : {type:Date, default:Date.now},
    modifyTime : {type:Date, default:Date.now}
}, {
    versionKey: false // 不需要versionkey
});


mongoose.model('chatgroups', ChatGroupSchema, 'chatgroups');
var ChatGroupModel = conn.model('chatgroups');




/**
 * 获取会话房间roleId列表
 * @param groupId:Number  房间id
 * @return [Number] roleId列表
 * **/
var getChatGroupRoleIds  = function (groupId, containIndirect) {
    return new Promise(function (resolve, reject) {
        ChatGroupModel.findById(groupId).exec(function (err, chatGroup) {
            if(err){
                logger.error(err,__info);
                reject(err);
            }else{
                if (chatGroup){
                    let roleIds = chatGroup.members.map(i=>Number(i.roleId));
                    if (containIndirect){
                        roleIds.push.apply(roleIds, chatGroup.tempMembers);
                    }
                    resolve(roleIds);
                }else{
                    logger.error("no such group",__info);
                    resolve([]);
                }
            }
        });
    })
};


var batchGetChatGroupRoleIds = function (groupIds, containIndirect) {
    return new Promise(function (resolve, reject) {
        ChatGroupModel.find({_id:{$in:groupIds}}).exec(function (err, chatGroups) {
            if (err){
                logger.error(err,__info);
                reject(err);
            }else{
                if (chatGroups){
                    let result = [];
                    for (let chatGroup of chatGroups){
                        let roleIds = chatGroup.members.map(i=>Number(i.roleId));
                        if (containIndirect){
                            roleIds.push.apply(roleIds, chatGroup.tempMembers);
                        }
                        result = result.concat(roleIds);
                    }
                    resolve(result);
                }else{
                    logger.error("no such group",__info);
                    resolve([]);
                }
            }
        })
    })
};
exports.batchGetChatGroupRoleIds = batchGetChatGroupRoleIds;

var getChatGroupById = function (groupId) {
    return new Promise(function (resolve, reject) {
        ChatGroupModel.findById(groupId).exec(function (err, chatGroup) {
            if(err){
                logger.error(err,__info);
                reject(err);
            }else{
                if (chatGroup){
                    let newChatGroup = {};
                    newChatGroup._id = chatGroup._id;
                    newChatGroup.name = chatGroup.name;
                    newChatGroup.state = chatGroup.state;
                    newChatGroup.type = chatGroup.type;
                    newChatGroup.topicType = chatGroup.topicType;
                    newChatGroup.topicId = Number(chatGroup.topicId);
                    newChatGroup.ownerRoleId = Number(chatGroup.ownerRoleId);
                    newChatGroup.resourceId = Number(chatGroup.resourceId);
                    newChatGroup.affairId = Number(chatGroup.affairId);
                    newChatGroup.avatar = chatGroup.avatar;
                    newChatGroup.tempMembers = chatGroup.tempMembers;
                    newChatGroup.members = chatGroup.members.map(i=>({
                        state:i.state,
                        type:i.type,
                        affairId:Number(i.affairId),
                        roleId:Number(i.roleId)
                    }));
                    newChatGroup.createTime = chatGroup.createTime;
                    newChatGroup.modifyTime = chatGroup.modifyTime;
                    resolve(newChatGroup);
                }else{
                    logger.error("no such group",__info);
                    resolve(null);
                }
            }
        });
    })
};

exports.getChatGroupById = getChatGroupById;
/**
 * 获取会话房间成员列表
 * @param groupId:Number  房间id
 * @return [{roleId:Number,affairId:Number,type:Number,state:Number}] 成员列表
 * **/
var getChatGroupMembers  = function (groupId) {
    return new Promise(function (resolve, reject) {
        ChatGroupModel.findById(groupId,'members').exec(function (err, chatGroup) {
            if(err){
                logger.error(err,__info);
                reject(err);
            }else{
                if (chatGroup){
                    resolve(chatGroup.members);
                }else{
                    logger.error("no such group",__info);
                    resolve([]);
                }
            }
        });
    })
};



exports.addMember = function(groupId, member){
    return new Promise(function (resolve, reject) {
        ChatGroupModel.update({_id:groupId},{$addToSet:{members:member}},function (err, result) {
            if (err){
                logger.error(err,__info);
                reject(err);
            }else {
                resolve(true);
            }
        });
    })
};

/**
 * 查询角色是否在指定讨论组中
 * @param roleId: Number 角色id
 * @param groupId:Number 讨论组id
 * @return [Number] 会话房间id列表
 *  **/
exports.checkIfInChatGroup = function (roleId, groupId) {
    return new Promise(function (resolve, reject) {
        getChatGroupRoleIds(groupId).then(res=>{
            let result = res.indexOf(roleId)>-1?true:false;
            resolve(result);
        }).catch(err=>{
            logger.error(err,__info);
            reject(err);
        });
    })
};






exports.getChatGroupRoleIds = getChatGroupRoleIds;
