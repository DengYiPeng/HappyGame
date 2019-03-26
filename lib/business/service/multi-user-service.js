


let onlineMap = new Map();
let cacheUserInfo = function (username, userInfo) {
    return new Promise(function (resolve, reject) {
        onlineMap.set(username, userInfo);
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
        resolve(true);
    })
};


exports.cacheUserInfo = cacheUserInfo;
exports.getUserInfoInMap = getUserInfoInMap;
exports.deleteUserInfo = deleteUserInfo;