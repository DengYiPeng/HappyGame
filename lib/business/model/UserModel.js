const mongoose = require('mongoose')
const Conf = require('../../config/config')
const SchemaTypes = mongoose.Schema.Types;
const conn =mongoose.createConnection(Conf.MONGO.URL+Conf.MONGO.DB1); //连接mongodb数据库
const logger = require('../../util/logger-factory').newLogger('message');

var Schema = mongoose.Schema;


//TODO 先不做index,等查询逻辑出来之后做组合索引,目前单列索引不符合要求,目前暂时需要支持的业务为
var UserSchema = new Schema({
    _id         :   String,
    username    :   String,
    password    :   String,  //用于存储消息的类型提高信息检索的效率
    roleType    :   Number,
    exp         :   Number,
}, {
    versionKey: false // 不需要versionkey
});
UserSchema.index({username:1}, {unique:true});



mongoose.model('User', UserSchema, 'User');
var model= conn.model('User');