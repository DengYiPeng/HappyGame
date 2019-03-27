/**
 * Created by njuDYP on 17/12/28.
 */
const app = require('../app-path');
const ip_address = process.env.HOST_ADDRESS || getIPAddress();
const env = 'debug';


function getIPAddress(){
    const interfaces = require('os').networkInterfaces();
    for(const devName in interfaces){
        const iface = interfaces[devName];
        for(let i=0; i<iface.length; i++){
            const alias = iface[i];
            if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal){
                return alias.address;
            }
        }
    }
}

var application_conf = {
    ip : ip_address,
};


const conf = {
    APPLICATION: {
        local_ip: getIPAddress(),
        ip: application_conf.ip,
    },
    MONGO: {
        URL: 'mongodb://' + "119.23.29.56" + ':27017/',
        DB1: 'game',
    },
    CONNECTOR: {
        PORT: 7041,
    },
    TIME: {
        SERVER_CONNECTION_TIMEOUT: 5000,
        CLEAR_CLIENT_TIME: 60 * 60 * 1000,
        REQUEST_TIMEOUT: 20000
    },
    USER: {
        MAP_INDEX:0,
        X_AXIS:0,
        Y_AXIS:0,
        ATK:10,
        DEF:10,
        MAGIC:10,
        HP:20,
        MP:20
    },
    MAX_DATA_LENGTH: 10000,
    rootDir: app.dirPath,
};
module.exports = conf;
