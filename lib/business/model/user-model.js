const Conf = require('../../config/config');

class UserModel {

    constructor(username, roleType){
        this.username = username;
        this.roleType = roleType;
        this.atk = Conf.USER.ATK;
        this.def = Conf.USER.DEF;
        this.mapIndex = Conf.USER.MAP_INDEX;
        this.xAxis = Conf.USER.X_AXIS;
        this.yAxis = Conf.USER.Y_AXIS;
        this.hp = Conf.USER.HP;
        this.mp = Conf.USER.MP;
    }

}

module.exports = UserModel;