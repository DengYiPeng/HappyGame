/**
 * Created by zp on 16/10/27.
 */
const mongoose = require('mongoose'), Conf = require('../../config/config'),Promise = require('promise'),Common = require('../../util/common');
require('mongoose-long')(mongoose);
const SchemaTypes = mongoose.Schema.Types;
const conn =mongoose.createConnection(Conf.MONGO.URL+Conf.MONGO.DB1); //连接mongodb数据库
const events = require('events');
const logger = require('../../util/logger-factory').newLogger('message');
const _ = require('underscore');
const Constants = require('../../constants');

/**1.查出每个独立会话的历史聊天记录 affairChat{type，fromUserId,affairId,toUserId} noticeChat {type,rid,
 * 2.查出一个人所有的事务内聊天，我们在事务列表中会获取所有的事务内双人聊天
 * 3.查看一个公告内的所有官方聊天，以及某个客方中所有与官方的对话
 * 4.一组会话房间所有与对话
 *  **/

var Schema = mongoose.Schema;


//TODO 先不做index,等查询逻辑出来之后做组合索引,目前单列索引不符合要求,目前暂时需要支持的业务为
var MessageSchema = new Schema({
    _id         :   String,
    _key        :   String,
    tp          :   Number,  //用于存储消息的类型提高信息检索的效率
    sub         :   Number,
    name        :   String,
    time        :   Number,  //时间戳用于和时间有关的查询
    fromUserId  :   SchemaTypes.Long,
    fromRoleId  :   SchemaTypes.Long,
    toUserId    :   SchemaTypes.Long,
    index       :   Number,
    toRoleId    :   SchemaTypes.Long,
    affairId    :   SchemaTypes.Long,
    groupId     :   SchemaTypes.Long,
    content     :   String,  //存放message
    apns        :   String,
    state       :   Number,
    options     :   String,
}, {
    versionKey: false // 不需要versionkey
});
MessageSchema.index({affairId:1,_key:1,time:-1});



mongoose.model('Message', MessageSchema, 'Messages');
var model= conn.model('Message');

exports.save = function (msg) {
    return new Promise(function (resolve,reject) {
        var tmp = {};
        tmp._id = msg._id;
        tmp._key = msg._key;//聊天室id
        tmp.tp = msg.type;
        tmp.sub= msg.sub;
        tmp.name = msg.name;
        tmp.time = msg.time;
        tmp.fromUserId = msg.fromUserId;
        tmp.index = msg.index;
        tmp.content = msg.content;
        msg.toUserId&&(tmp.toUserId = msg.toUserId);
        msg.toRoleId&&(tmp.toRoleId = msg.toRoleId);
        msg.affairId&&(tmp.affairId = msg.affairId);
        msg.groupId&&(tmp.groupId= msg.groupId);
        msg.fromRoleId&&(tmp.fromRoleId=msg.fromRoleId);
        msg.apns&&(tmp.apns=msg.apns);
        tmp.state = msg.state ? msg.state : Constants.MSG_STATE.DEFAULT;//默认state为0
        msg.options&&(tmp.options = msg.options);
        new model(tmp).save(function (err,res) {
           if(err){
               logger.error(err,__info);
               reject(err);
           }else{
               resolve(res);
           }
        });
    });
};


/**
 * 查询某个独立对话中的某段时间的消息,返回消息条数以及其中的未读消息
 */
exports.findMessageInSession = function (key,limit,endTime,beginTime, desc) {
    return new Promise(function (resolve, reject) {
        limit = limit || 20;
        // if(limit > 100){
        //     limit = 100;
        // }

        desc = desc === undefined ? true : desc;
        let sort = desc ? -1 : 1;
        let query = {};
        query.time= {'$gt': beginTime || Number(0), '$lt': endTime||new Date().getTime()};
        query._key = key;

        let temp_query = model.find(query).sort({time:sort});
        if (limit !== -1){
            temp_query = temp_query.limit(limit);
        }
        temp_query.exec(function (err, records) {
            if(err){
                logger.error(err,__info);
                resolve(false);
            }else{
                let res =[];
                records.forEach(function (item) {
                    res.push(item._doc);
                });
                res.reverse();
                resolve(res);
            }
        });
    });
};

/**
 * 查询根据会话房间ID列表,获取各自的最新消息
 */
exports.findLatestMessage  = function (groupIds,userId) {
    return new Promise(function (resolve,reject) {
        var res = [];

        var query = {};
        var limit = 1;
        var count = 0;
        var obj;
        var myEventEmitter = new events.EventEmitter();
        myEventEmitter.on('next',addResult);
        function addResult() {
            count++;
            obj.forEach(function (item) {
                res.push(item._doc);
            });

            if(count==groupIds.length){
                resolve(res);
            }
        }

        for(let groupId of groupIds){
            query.time= {'$gte': Number(0), '$lt': new Date().getTime()};
            query._key = Common.generateKeyByGroupId(groupId);
            model.find(query).sort({time:-1}).limit(limit).exec(function (err, records) {
                if(err){
                    logger.error(err,__info);
                    resolve(false);
                }else{
                    obj = records;
                    myEventEmitter.emit('next');
                }
            });
        }

    })
}

/**
 * 查询根据会话房间key,获取会话的最新消息
 *
 */

var findLastMsgByKey  = function (key) {
    return new Promise(function (resolve,reject) {
        model.find({_key:key}).sort({time:-1}).limit(1).exec(function (err, records) {
            if(err){
                logger.error(err,__info);
                reject(false);
            }else{
                if(records.length >= 1){
                    resolve(records[0]);
                }else{
                    resolve({});
                }
            }
        });
    });
};

exports.findLastMsgByKey = findLastMsgByKey;

exports.findLastMsgByKeys  = function (keys) {
    // return new Promise(function (resolve,reject) {
        var ps = [];
        _.each(keys, function (key) {
            ps.push(findLastMsgByKey(key));
        });
        return Promise.all(ps);
    // });
}

//TODO 只实现查找是发送方的roleId
exports.findKeysByFromRoleId = function (roleId) {

    return new Promise(function (resolve,reject) {
      model.aggregate([
          { $match  : { fromRoleId : roleId ,tp : { $ne : Constants.CHAT_TYPE.GROUP }} },
          { $sort   : { time : -1 }  },
          { $group  : { _id: "$_key", time : {$first : "$time"}} },
          { $sort   : { time : -1 }  }
      ]).then(function (data) {
          var result = data.map(function (key) {
              return {_key:key._id, time: key.time};
          });

          resolve(result);
      }).catch(function (err) {
          reject(err);
      });
    });
}

exports.findKeysByToRoleId = function (roleId) {

    return new Promise(function (resolve,reject) {
        model.aggregate([
            { $match  : { toRoleId : roleId ,tp : { $ne : Constants.CHAT_TYPE.GROUP }} },
            { $sort   : { time : -1 }  },
            { $group  : { _id: "$_key", time : {$first : "$time"}} },
            { $sort   : { time : -1 }  }
        ]).then(function (data) {
            var result = data.map(function (key) {
                return {_key:key._id, time: key.time};
            });

            resolve(result);
        }).catch(function (err) {
            reject(err);
        });
    });
}

exports.findKeysByGroupIds = function (groupIds) {
    return new Promise(function (resolve,reject) {
        model.aggregate([
            { $match  : { groupId : {$in : groupIds} } },
            { $sort   : { time : -1 }  },
            { $group  : { _id: "$_key", time : {$first : "$time"}} },
            { $sort   : { time : -1 }  }
        ]).then(function (data) {
            var result = data.map(function (key) {
                return {_key:key._id, time: key.time};
            });

            resolve(result);
        }).catch(function (err) {
            reject(err);
        });
    });
}

/**
 * 查询消息
 * @param query:Object 查询条件
 */

exports.find = function(query){
    return new Promise(function (resolve,reject) {
        model.find(query).exec(function (err, records) {
            if(err){
                logger.error(err,__info);
                reject(false);
            }else{
                // var begin = new Date();
                // records = filter.filterMesArr(records);
                // console.log(new Date() - begin);
                resolve(records);
            }
        });
    });
}

/**
 * 查询消息列表
 * @param idArr:Array[] id列表
 */
exports.findByIds = function(idArr){
    return new Promise(function (resolve,reject) {
        model.find({ _id: { $in: idArr } } ).exec(function (err, records) {
            if(err){
                logger.error(err,__info);
                reject(err);
            }else{
                resolve(records);
            }
        });
    });
}

/**
 * 修改消息
 * @param msgId: Number 消息Id
 * @param state: Number 状态值
 */
exports.updateMsgState = function (msgId, state) {
    return new Promise(function (resolve, reject) {
        var whereStr = {"_id":msgId};  // 查询条件
        var updateStr = {$set: { "state" : state }};
        model.updateOne(whereStr, updateStr, function(err, res) {
            if(err){
                logger.error(err,__info);
                reject(err);
            }else{
                resolve(res);
            }
        });
    });
}

exports.model = model;

let mergeNotify = function (msg, lastMsg) {
    return new Promise(function (resolve, reject) {
        let query = {
            time : lastMsg.time,
            _id : lastMsg._id
        };
        let oldContent = JSON.parse(lastMsg.content);
        if (!_.isArray(oldContent)){
            oldContent = [oldContent];
        }
        oldContent.push(JSON.parse(msg.content));
        let time = Math.max(msg.time, lastMsg.time);
        let update = {
            $set:{
                content:JSON.stringify(oldContent),
                time:time
            }
        };
        let options = {
            upsert:false,
            setDefaultsOnInsert:false
        };
        model.update(query,update,options).exec().then(res=>{
            if (res.nModified === 0) {
                loopReMerge(msg, 5);
            }
            resolve(lastMsg);
        }).catch(err=>{
            resolve(lastMsg);
        })
    })
};

let loopReMerge = function (msg, maxReTry) {
    reMergeNotify(msg).then(result=>{
        maxReTry--;
        if (maxReTry>0&&result===false){
            loopReMerge(list, maxReTry);
        }
    })
};

let reMergeNotify = function(msg){
    return new Promise(function (resolve, reject) {
        findLastMsgByKey(msg._key).then(lastMsg=>{
            let query = {
                time : lastMsg.time,
                _id : lastMsg._id
            };
            let oldContent = JSON.parse(lastMsg.content);
            if (!_.isArray(oldContent)){
                oldContent = [oldContent];
            }
            oldContent.push(JSON.parse(msg.content));
            let update = {
                $set:{
                    content:JSON.stringify(oldContent),
                    time:msg.time
                }
            };

            let options = {
                upsert:false,
                setDefaultsOnInsert:false
            };
            model.update(query,update,options).exec().then(res=>{
                if (res.nModified === 0){
                    resolve(false);
                }else{
                    resolve(true);
                }
            }).catch(err=>{
                resolve(false);
            })
        })
    })
};
exports.mergeNotify = mergeNotify;
