const Conf = require('../../config/config');

class EquipmentModel {

    constructor(type, templateId, atk, dfe, magic, username){
        this.type = type;
        this.templateId = templateId;
        this.atk = atk;
        this.dfe = dfe;
        this.magic = magic;
        this.username = username
    }

}

module.exports = EquipmentModel;