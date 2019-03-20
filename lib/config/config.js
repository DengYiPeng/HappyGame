/**
 * Created by zp on 16/10/14.
 */
let env = process.env.ACTIVE_PROFILE || 'debug';
env = env.toLowerCase();

const debug = require('../config/debug');


module.exports = (function () {
    let config = debug;
    config.ACTIVE_PROFILE = env;
    return config;
})();


