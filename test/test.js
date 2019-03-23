

const client = require('../client/client');


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

let ip = getIPAdress();
let address = ip + ':7041';

let res = function(data){
    console.log(data);
};

let signRes = function(data){
    client.getUserLevelInfo(res, res);
};
client.signIn(address, '邓逸鹏', signRes, signRes);
