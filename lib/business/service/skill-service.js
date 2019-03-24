
const SkillConfig = require('../../config/skill-config');
const UpskillConfig = require('../../config/upskill-config');

let getSkillConfig = function () {
    return new Promise(function (resolve, reject) {
        resolve(SkillConfig);
    })
};


let getUpSkillConfig = function(){
    return new Promise(function (resolve, reject) {
        resolve(UpskillConfig);
    })
};

exports.getSkillConfig = getSkillConfig;
exports.getUpskillConfig = getUpSkillConfig;