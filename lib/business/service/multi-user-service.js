
const SimpleResponse = require('../../form/SimpleResponse');
const SpecialRequestIdTypes = require('../../constants/SpecialRequestIdType');
const UserDao = require('../dao/user-dao');

let onlineSocketMap = new Map();
let cacheUserInfo = function (username, socket) {
    return new Promise(function (resolve, reject) {
        onlineSocketMap.set(username, socket);
        UserDao.findByUsername(username).then(userInfo=>{
            resolve(userInfo);
        }).catch(err=>{
            reject(err);
        });
    })
};


let getUserInfoInMap = function (mapIndex) {
    return new Promise(function (resolve, reject) {
        let promises= [];
        for(let value of onlineSocketMap.keys()){
            promises.push(UserDao.findByUsername(value));
        }
        Promise.all(promises).then(results=>{
            let result = [];
            for(let user of results){
                if (user.mapIndex === mapIndex){
                    result.push(user);
                }
            }
            resolve(result);

        }).catch(err=>{
            reject(err);
        });
    })
};

let deleteUserInfo = function (username) {
    return new Promise(function (resolve, reject) {
        onlineSocketMap.delete(username);
        resolve(true);
    })
};


let getUserInfoByMap = function(){
    return new Promise(function (resolve, reject) {

        let promises= [];
        for(let value of onlineSocketMap.keys()){
            promises.push(UserDao.findByUsername(value));
        }
        Promise.all(promises).then(results=>{
            let result = new Map();
            for(let value of results){
                let temp = result.get(value.mapIndex);
                temp || (temp = []);
                temp.push(value);
                result.set(value.mapIndex, temp);
            }
            resolve(result);
        }).catch(err=>{
            reject(err);
        });

    })
};

exports.cacheUserInfo = cacheUserInfo;
exports.getUserInfoInMap = getUserInfoInMap;
exports.deleteUserInfo = deleteUserInfo;
exports.getUserInfoByMap = getUserInfoByMap;



let sendOtherUserInfoToUsers = function(){
    getUserInfoByMap().then(userInfoMap=>{
        for(let mapIndex of userInfoMap.keys()){
            let allUserInfos = userInfoMap.get(mapIndex);
            for(let userInfo of allUserInfos){
                let tempSocket = onlineSocketMap.get(userInfo.username);
                tempSocket.send(SimpleResponse.OK(SpecialRequestIdTypes.OTHER_USER_INFO, allUserInfos));
            }
        }
    }).catch(err=>{
        console.log(err);
    })
};

setInterval(sendOtherUserInfoToUsers, 1000);