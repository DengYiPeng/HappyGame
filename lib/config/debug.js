/**
 * Created by njuDYP on 17/12/28.
 */
const app = require('../app-path');
const ip_address = process.env.HOST_ADDRESS || getIPAdress();
const env = 'debug';


function getIPAdress(){
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
        local_ip: getIPAdress(),
        ip: application_conf.ip,
    },
    MONGO: {
        URL: 'mongodb://' + "192.168.1.204" + ':27018/',
        DB1: 'new-cloud-chat',
    },
    CONNECTOR: {
        PORT: 7041,
    },
    TIME: {
        SERVER_CONNECTION_TIMEOUT: 5000,
        CLEAR_CLIENT_TIME: 60 * 60 * 1000,
        REQUEST_TIMEOUT: 20000
    },
    MAX_DATA_LENGTH: 10000,
    rootDir: app.dirPath,
};
module.exports = conf;
