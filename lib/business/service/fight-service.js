const FightConfig = require('../../config/fight-config');
const MonsterModel = require('../model/monster-model');
const UserDao = require('../dao/user-dao');
const UserService = require('../service/user-service');
const SkillConfig = require('../../config/skill-config');
const FightResultType = require('../../constants/FightResultType');
const DeathLossConfig =require('../../config/death-loss-config');
const MultiUserService = require('../service/multi-user-service');

let fightMap = {};

let generateFight = function (username, monsterType, socket) {
    return new Promise(function (resolve, reject) {
        let nowInfo = fightMap[username];
        if(nowInfo){
            resolve(nowInfo)
        }else{
            UserService.getUserInfo(username, socket).then(userInfo=>{
                let randomNumber = Math.random();
                if (randomNumber < FightConfig.FIGHT_PROBABILITY){
                    let monster = new MonsterModel(monsterType);
                    let characters = {};
                    characters[monster.id] = monster;
                    characters[username] = userInfo;
                    let info = [];
                    let fightInfos = {characters:characters, info:info, result:FightResultType.CONTINUE};
                    fightMap[username] = fightInfos;
                    resolve(fightInfos);
                }else{
                    resolve(null);
                }
            }).catch(err=>{
                reject(err);
            });
        }
    })
};

let fight = function(username, skillKey, enemyId, socket){
    let nowInfo = fightMap[username];
    return new Promise(function (resolve, reject) {
        UserDao.findByUsername(username).then(user=>{
            if (!nowInfo) reject('你不在战斗中');
            nowInfo = act(nowInfo, username, enemyId, skillKey);
            nowInfo = checkMonster(nowInfo, enemyId);
            if (nowInfo.result === FightResultType.SUCCESS){
                let nowUser = nowInfo.characters[username];
                delete fightMap[username];
                return UserService.winFight(username, nowInfo.gold, nowInfo.exp, nowUser.hp, nowUser.mp);
            }else{
                nowInfo = act(nowInfo, enemyId, username, 'ATTACK');
                nowInfo = checkUser(nowInfo, username);
                if (nowInfo.result === FightResultType.FAIL){
                    delete fightMap[username];
                    return UserService.failFight(username);
                }else{
                    let nowUser = nowInfo.characters[username];
                    return UserService.winFight(username, 0, 0, nowUser.hp, nowUser.mp);
                }
            }
        }).then(result=>{
            return UserService.getUserInfo(username, socket);
        }).then(result=>{
            resolve(nowInfo);
        }).catch(err=>{
            console.log(err);
            reject(err);
        })
    });
};

let checkUser = function (nowInfo, username) {
    let user = nowInfo.characters[username];
    if (user.hp === 0){
        nowInfo.result = FightResultType.FAIL;
        nowInfo.exp = Math.min(user.exp, DeathLossConfig.EXP_LOSS);
        nowInfo.gold = Math.min(user.gold, DeathLossConfig.GOLD_LOSS);
    }
    return nowInfo;
};

let checkMonster = function (nowInfo, enemyId) {
    let monster = nowInfo.characters[enemyId];
    if (monster.hp === 0){
        nowInfo.result = FightResultType.SUCCESS;
        nowInfo.exp = monster.exp;
        nowInfo.gold = monster.gold;
    }
    return nowInfo;
};

let act = function (nowInfo, characterId, targetCharacterId, skillKey) {
    let character = nowInfo.characters[characterId];
    let skill_level = character.skills[skillKey].level;
    let skillConfig = SkillConfig[skillKey];
    let atk_coefficient = getCoefficient('ATK_COEFFICIENT', skillConfig, skill_level);
    let magic_coefficient = getCoefficient('MAGIC_COEFFICIENT', skillConfig, skill_level);
    let def_coefficient = getCoefficient('DEF_COEFFICIENT', skillConfig, skill_level);
    let weapon = validateWeaponOrArmor(character.weapon);
    let armor = validateWeaponOrArmor(character.armor);
    let totalATK = character.atk + weapon.atk + armor.atk;
    let totalMagic = character.magic + weapon.magic + armor.magic;
    let totalDEF = character.def + weapon.def + armor.def;
    let totalDamage = atk_coefficient * totalATK + magic_coefficient * totalMagic + def_coefficient * totalDEF;
    let targetCharacter = nowInfo.characters[targetCharacterId];
    totalDamage = Math.max(1, totalDamage - (targetCharacter.def * (1-skillConfig.DEF_IGNORE)));
    totalDamage = parseInt(totalDamage);


    let magicCost = skillConfig.MAGIC_COST;
    if (character.mp >= magicCost ){
        character.mp = character.mp - magicCost;
    }else{
        magicCost = 0;
        totalDamage = 0;
    }

    targetCharacter.hp = Math.min(targetCharacter.hp - totalDamage, targetCharacter.maxHp);
    targetCharacter.hp = Math.max(targetCharacter.hp, 0);
    nowInfo.characters[targetCharacterId] = targetCharacter;
    nowInfo.characters[characterId] = character;

    let newInfo = {characterId:characterId, targetCharacterId:targetCharacterId, skillKey:skillKey, totalDamage:totalDamage, magicCost:magicCost};
    nowInfo.info.push(newInfo);
    return nowInfo;
};


let validateWeaponOrArmor = function (weapon) {
    if (!weapon) weapon = {};
    weapon.atk || (weapon.atk = 0);
    weapon.def || (weapon.def = 0);
    weapon.magic || (weapon.magic = 0);
    return weapon;
};



let getCoefficient = function(key, skillConfig, skillLevel){
    let result = 0;
    try {
        result = skillConfig[key][skillLevel];
    }catch (e) {

    }
    return result;
};

exports.generateFight = generateFight;
exports.fight = fight;