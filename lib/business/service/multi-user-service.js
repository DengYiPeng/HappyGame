
const SimpleResponse = require('../../form/SimpleResponse');
const SpecialRequestIdTypes = require('../../constants/SpecialRequestIdType');

let onlineMap = new Map();
let onlineSocketMap = new Map();
let cacheUserInfo = function (username, userInfo, socket) {
    return new Promise(function (resolve, reject) {
        onlineMap.set(username, userInfo);
        onlineSocketMap.set(username, socket);
        resolve(userInfo);
    })
};


let getUserInfoInMap = function (mapIndex) {
    return new Promise(function (resolve, reject) {
        let result = [];
        for(let value of onlineMap.values()){
            if (value.mapIndex === mapIndex){
                result.push(value);
            }
        }
        resolve(result);
    })
};

let deleteUserInfo = function (username) {
    return new Promise(function (resolve, reject) {
        onlineMap.delete(username);
        onlineSocketMap.delete(username);
        resolve(true);
    })
};


let getUserInfoByMap = function(){
    return new Promise(function (resolve, reject) {
        let result = new Map();
        for(let value of onlineMap.values()){
            let temp = result.get(value.mapIndex);
            temp || (temp = []);
            temp.push(value);
            result.set(value.mapIndex, temp);
        }
        resolve(result);
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