

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
let address ='119.23.29.56' + ':7041';

let res = function(data){
    console.log(data);
};

let signRes = function(data){
    client.strengthen('5c979f9a292e034040fb4bad', 'MAGIC', res, res);
};

// client.fight('ATTACK', '9e1b4551-8058-a6b4-f95e-410c9b67de61', res, res);
client.signIn(address, '邓逸鹏', res, res);

