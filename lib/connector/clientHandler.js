/**
 * Created by gbc on 17/12/1.
 */
const Constants = require("../constants");
const _ = require('underscore');
const logger = require('../util/logger-factory').newLogger('connector-clientHandler');


let clientHandler = {};


let guid = function() {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
};








exports.handler = clientHandler;
