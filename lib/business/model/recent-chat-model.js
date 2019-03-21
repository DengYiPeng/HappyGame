const mongoose = require('mongoose'), Conf = require('../../config/config'),Promise = require('promise'),Common = require('../../util/common');
require('mongoose-long')(mongoose);
const SchemaTypes = mongoose.Schema.Types;
const conn =mongoose.createConnection(Conf.MONGO.URL+Conf.MONGO.DB1); //连接mongodb数据库
const logger = require('../../util/logger-factory').newLogger('recent-chat-model');
const Schema = mongoose.Schema;

const RecentChatSchema = new Schema({
    _id : String,
    userId : SchemaTypes.Long,
    roleIds :[SchemaTypes.Long],
    lastVisitRoleId:{type:SchemaTypes.Long, default: 0},
    key : String,
    type : Number,
    lastReadIndex : {type:Number, default:0},
    sticky : {type:Boolean, default:false},
    disturbFree : {type:Boolean, default:false},
    removed : {type:Boolean, default:false},
    latestMsgId:String,
    lastReceivedIndex: {type:Number, default:0},
    time:Number,
    unreadCnt:{type:Number, default:0},
    active: {type:Boolean, default:false},
    lastApnMsgId:{type:String, default:''}
    }
, {
    versionKey: false // 不需要versionkey
});

RecentChatSchema.index({key:1,userId:1}, {unique:true});

mongoose.model('RecentChat', RecentChatSchema, 'RecentChats');
var RecentChatModel = conn.model('RecentChat');

RecentChatModel.ensureIndexes(function (err) {
    if (err){
        logger.error(JSON.stringify(err),__info);
    }
});


RecentChatModel.on('index', function (err) {
    if (err){
        logger.error(JSON.stringify(err),__info);
    }
});

/**
 * 消息发送时，标记消息发送者已读
 * @param groupId:Number  房间id
 * @return Promise res:boolean
 * **/
exports.markReadWhenSend = function (userId, roleId, key, index, msgId, time, chatType) {
    //此处设置type的原因是因为避免一个会话中，第一个发送消息的人不能正确地生成recent-chat-model的问题
    return new Promise(function (resolve, reject) {
        let query = {
            key:key,
            userId:userId
        };
        let update = {
            $set: {
                lastReadIndex:index,
                latestMsgId:msgId,
                lastReceivedIndex:index,
                time:time,
                removed:false,
                unreadCnt:0,
                type:chatType,
                active:true,
                lastApnMsgId : ''
            },
            $addToSet: {
                roleIds:roleId
            }
        };
        let options = {
            upsert:true,
            setDefaultsOnInsert:true
        };
        RecentChatModel.update(query, update, options).exec().then(res=>{
            resolve(true);
        }).catch(err=>{
            logger.error(err, __info);
            reject(err);
        });
    });
};

exports.findByKeyAndUserId = function (key, userId) {
    return new Promise(function (resolve, reject) {
        let query = {
            key:key,
            userId:userId
        };
        RecentChatModel.findOne(query).exec().then(oneDoc=>{
            resolve(oneDoc);
        }).catch(err=>{
            logger.error(err, __info);
            reject(err);
        })
    })
};


exports.findByKeyAndUserIds = function (key, userIds) {
    return new Promise(function (resolve, reject) {
        let query = {
            key:key,
            userId:{$in:userIds}
        };
        RecentChatModel.find(query).exec().then(docs=>{
            resolve(docs);
        }).catch(err=>{
            logger.error(err, __info);
            reject(err);
        })
    })
};


/**
 * 阅读消息时，标记消息已读
 * @param groupId:Number  房间id
 * @return Promise res:boolean
 * **/
var markRead = function(userId, roleId, key, index){
    return new Promise(function (resolve ,reject) {
        let query = {
            key:key,
            userId:userId
        };
        let update = {
            $set:{
                lastReadIndex:index,
                unreadCnt:0,
                lastApnMsgId:''
            },
            $addToSet:{
                roleIds: roleId
            }
        };
        RecentChatModel.update(query, update).exec().then(res=>{
            resolve(true);
        }).catch(err=>{
            logger.error(err, __info);
            reject(err);
        });
    });
};
exports.markRead = markRead;

var justMarkRead = function(userId, roleId, key, index){
    return new Promise(function (resolve ,reject) {
        let query = {
            key:key,
            userId:userId
        };
        let update = {
            $set:{
                lastReadIndex:index,
                unreadCnt:0,
                lastApnMsgId:'',
            }
        };
        RecentChatModel.update(query, update).exec().then(res=>{
            resolve(true);
        }).catch(err=>{
            logger.error(err, __info);
            reject(err);
        });
    });
};
exports.justMarkRead = justMarkRead;


/**
 * 更新角色最近会话
 * @param members:[roleId:Number,userId:Number]  讨论组成员
 * @return Promise res:boolean
 * **/
exports.upsert = function (members, key, index, msgId, time, chatType, isActiveMessage, apns) {
    return new Promise(function (resolve, reject) {
        let promises = [];
        let apnRoleIds = [];
        try {
            apnRoleIds = JSON.parse(apns);
        }catch (e) {
        }
        let apnRoleIdSet = new Set(apnRoleIds);
        let apnUserIdSet = new Set();
        members.forEach(member=>{
           if (apnRoleIdSet.has(member.roleId)){
               apnUserIdSet.add(member.userId);
           }
        });
        members.forEach(member=>{
            let needApn = apnUserIdSet.has(member.userId);
            promises.push(findAndUpsert(key, index, msgId, time ,chatType, member, isActiveMessage, needApn));
        });
        Promise.all(promises).then(resultList=>{
            let reUpsertList = resultList.filter(i=>i.success===false);
            loopReUpsert(reUpsertList, 10);
            resolve(true);
        }).catch(err=>{
            logger.error(JSON.stringify(err),__info);
            reject(err);
        });
    });
};


let findAndUpsert = function (key, index, msgId, time, chatType, member, isActiveMessage, needApn) {
    return new Promise(function (resolve ,reject) {
        let query = {key:key, userId:member.userId};
        let update = {
            $set: {
                latestMsgId: msgId,
                time: time,
                removed: false,
                type: chatType,
                unreadCnt: 0
            },
            $addToSet: {
                roleIds: member.roleId
            }
        };
        let options = {
            upsert: true,
            setDefaultsOnInsert: true
        };
        RecentChatModel.findOne(query).exec().then(oneRecent=> {
            let unreadCount = isActiveMessage ? 1 : 0;
            let lastVisitRoleId  = 0;
            let lastApnMsgId = needApn ? msgId : '';
            if (oneRecent) {
                unreadCount = oneRecent.unreadCnt ? oneRecent.unreadCnt : 0;
                let lastReadIndex = oneRecent.lastReadIndex ? oneRecent.lastReadIndex : 0;
                if (lastReadIndex !== index && isActiveMessage){
                    unreadCount = unreadCount + 1
                }
                isActiveMessage = isActiveMessage || oneRecent.active;
                lastVisitRoleId  = oneRecent.lastVisitRoleId === 0 ? member.roleId : oneRecent.lastVisitRoleId;
                lastApnMsgId = oneRecent.lastApnMsgId === '' ? lastApnMsgId : oneRecent.lastApnMsgId;
            }
            update = {
                $set: {
                    latestMsgId: msgId,
                    time: time,
                    removed: false,
                    type: chatType,
                    unreadCnt: unreadCount,
                    active : isActiveMessage,
                    lastVisitRoleId : lastVisitRoleId,
                    lastApnMsgId : lastApnMsgId
                },
                $addToSet: {
                    roleIds: member.roleId
                }
            };
            return RecentChatModel.update(query, update, options).exec();
        }).then(updateResult=>{
            let upsertResult = {query: query, update : update, options : options};
            upsertResult.success = true;
            resolve(upsertResult);
        }).catch(err=>{
            let upsertResult = {query: query, update : update, options : options};
            upsertResult.success = false;
            resolve(upsertResult);
        });
    });
};

let loopReUpsert = function (reUpsertOptions, maxReTry) {
  reUpsert(reUpsertOptions).then(list=>{
      maxReTry--;
      if (maxReTry>0&&list.length>0){
          loopReUpsert(list, maxReTry);
      }
  })
};


let reUpsert = function(reUpsertOptions){
  return new Promise(function (resolve ,reject) {
      let promises = [];
      reUpsertOptions.forEach(reUpsertOption=>{
          promises.push(new Promise(function (tempResolve, tempReject) {
              let query = reUpsertOption.query;
              let update = reUpsertOption.update;
              let options = reUpsertOption.options;
              RecentChatModel.update(query,update, options,function (err, result) {
                  let upsertResult = {query: query, update : update, options : options};
                  if (err){
                      upsertResult.success = false;
                      tempResolve(upsertResult);
                  }else {
                      upsertResult.success = true;
                      tempResolve(upsertResult);
                  }
              });
          }))
      });
      Promise.all(promises).then(resultList=> {
          resultList = resultList.filter(i=>i.success ===false);
          resolve(resultList)
      }).catch(err=>{
          logger.error(JSON.stringify(err),__info);
          reject(err);
      });
  })
};

/**
 * 获取会话未读数
 * @param userId:Number 用户Id
 * @param key:String 会话key
 * @return Promise res: Number
 * **/
exports.getUnreadCount = function (userId, key) {
    return new Promise(function (resolve, reject) {
        RecentChatModel.find({key:key,userId:userId}).exec((err,docs)=>{
            if (err || docs.length === 0){
                logger.err(err,__info);
                resolve(0);
            }else {
                resolve(docs[0].unreadCnt);
            }
        });
    })
};