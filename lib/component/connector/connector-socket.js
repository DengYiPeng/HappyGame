
/**
 * Created by zp on 16/11/28.
 */
const util = require('util'), events = require('events');
const engine = require('engine.io');
const httpServer = require('http').createServer();
const WebSocketServer = require('ws').Server;

//create connector server
function createServer(port,host) {
    events.EventEmitter.call(this);
    host = host||'127.0.0.1';
    port  = parseInt(port);
    httpServer.listen(port,host);
    adapterOfEngine.call(this,httpServer);
    adapterOfWebSocket.call(this,httpServer);

}

util.inherits(createServer, events.EventEmitter);


function isOpen() {
    return this.readyState ==='open'||this.readyState ==='opening';
}

//engine.io协议
function adapterOfEngine(httpServer) {
    engine.Socket.prototype.isOpen = isOpen;
    let self = this;
    let engineServer = engine.attach(httpServer,{"transports"    :   ['websocket', 'polling']});

    engineServer.on('connection', function(socket){
        socket.binaryType = 'arraybuffer';
        socket.address = socket.remoteAddress;
        self.emit('connection',socket);
    });
}

//纯websocket协议
function adapterOfWebSocket(httpServer) {
    let self = this;
    let  wss = new WebSocketServer({server:httpServer ,path:'/mobile/'});
    wss.on('connection', function connection(socket) {
        socket.binaryType = 'arraybuffer';
        socket.address = socket.remoteAddress;
        socket.isOpen= isOpen;
        self.emit('connection',socket);
    });
}


module.exports = createServer;
