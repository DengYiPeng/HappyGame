const Conf = require('../../config/config');

class UserModel {

    constructor(username){
        this.username = username;
        this.atk = Conf.USER.ATK;
        this.def = Conf.USER.DEF;
        this.magic = Conf.USER.MAGIC;
        this.mapIndex = Conf.USER.MAP_INDEX;
        this.xAxis = Conf.USER.X_AXIS;
        this.yAxis = Conf.USER.Y_AXIS;
        this.hp = Conf.USER.HP;
        this.mp = Conf.USER.MP;
        this.maxHp = Conf.USER.HP;
        this.maxMp = Conf.USER.MP;
    }

}

module.exports = UserModel;