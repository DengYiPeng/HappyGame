
const SkillConfig = require('../../config/skill-config');
const UpskillConfig = require('../../config/upskill-config');
const UserService = require('../service/user-service');
const UserDao = require('../dao/user-dao');

let getSkillConfig = function () {
    return new Promise(function (resolve, reject) {
        let result = [];
        for(let key in SkillConfig){
            let temp = SkillConfig[key];
            result.push(temp);
        }
        resolve(result);
    })
};


let getUpSkillConfig = function(){
    return new Promise(function (resolve, reject) {
        let result = [];
        for(let key in UpskillConfig){
            let temp = UpskillConfig[key];
            temp.level = Number(key);
            result.push(temp);
        }
        resolve(result);
    })
};

let upskill = function(username, key){
    return new Promise(function (resolve, reject) {
        let newSkill = false;
        UserDao.findByUsername(username).then(user=>{
            let skills = user.skills;
            let nowSkill = skills[key];
            if (!nowSkill) {
                nowSkill = {};
                nowSkill.level = 0;
                newSkill = true;
            }
            let cost = UpskillConfig[nowSkill.level].COST;
            return UserService.spendMoney(username, cost);
        }).then(result=>{
            if (!result) return false;
            return UserDao.upSkill(username, key, newSkill);
        }).then(result=>{
            resolve(result);
        }).catch(err=>{
            console.log(err);
            reject(err);
        })
    })
};

exports.getSkillConfig = getSkillConfig;
exports.getUpskillConfig = getUpSkillConfig;
exports.upskill = upskill;