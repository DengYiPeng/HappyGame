
/**
 * Created by zp on 16/10/21.
 */
var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split('');
var possibleLength = possible.length;

var longToString = function (n) {
    var text = "";
    var a;
    if(n==0){
        return 'A';
    }
    while (n>0) {
        a = n%possibleLength;
        n = parseInt(n/possibleLength);
        text += possible[a];
    }
    return text;
};

let guid = function() {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
};



exports.generateRequestId = function(email) {
    return email+"$"+ longToString(new Date().getTime());
};

exports.guid = guid;

