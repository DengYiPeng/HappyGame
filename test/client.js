const io = require("engine.io-client");
const Constants = require('../lib/constants');

_socket = new io('ws://192.168.43.204:7041');

_socket.on('open', function () {

    console.log("connect");
    let data = {type:Constants.MSG_TYPE.SIGN_IN, email:'dyp', password:'123456'}
    _socket.send(new Buffer(JSON.stringify(data)))
    // 在这里我们就可以发送数据了
});

_socket.on("message", function (data) {

    console.log(data);

    // _socket.send(encode);
});


_socket.on("error", function (data) {

    console.log(data);

    // _socket.send(encode);
});