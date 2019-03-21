

const ResponseCode = require('../constants/ResponseCode');

class SimpleResponse {
    constructor(requestId, code, data){
        this.requestId = requestId;
        this.code = code;
        this.data = data;
    }
}

SimpleResponse.OK = function (requestId, data) {
    let response = new SimpleResponse(requestId, ResponseCode.OK, data);
    return new Buffer(JSON.stringify(response));
};

SimpleResponse.ERROR = function (requestId, data) {
    let response = new SimpleResponse(requestId, ResponseCode.ERROR, data);
    return new Buffer(JSON.stringify(response));};

module.exports = SimpleResponse;