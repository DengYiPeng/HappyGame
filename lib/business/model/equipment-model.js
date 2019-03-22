const Conf = require('../../config/config');

class EquipmentModel {

    constructor(type, templateKey, atk, def, magic, username, level){
        this.type = type;
        this.templateKey = templateKey;
        this.atk = atk;
        this.def = def;
        this.magic = magic;
        this.username = username;
        this.level = level;
    }

}

module.exports = EquipmentModel;