const MonsterConfig = require('../../config/monster-config');
const Common = require('../../util/common');

class MonsterModel{
    constructor(monsterType) {
        let tempConfig = MonsterConfig[monsterType];
        this.id = Common.guid();
        this.name = tempConfig.NAME;
        this.magic = tempConfig.MAGIC;
        this.magic || (this.magic = 0);
        this.atk = tempConfig.ATK;
        this.def = tempConfig.DEF;
        this.skills = tempConfig.SKILLS;
        this.exp = tempConfig.EXP;
        this.gold = tempConfig.GOLD;
        this.maxHp = tempConfig.MAX_HP;
        this.maxMp = tempConfig.MAX_MP;
        this.hp = tempConfig.MAX_HP;
        this.mp = tempConfig.MAX_MP;
        this.type = monsterType;
    }
}


module.exports = MonsterModel;