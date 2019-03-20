var _ = require('underscore');
var levels = ['log', 'error', 'info', 'trace', 'warn', 'debug'];


if(!global.hasOwnProperty('__info')){
    Object.defineProperty(global, '__info', {
        get: function () {
            var orig = Error.prepareStackTrace;
            Error.prepareStackTrace = function (_, stack) {
                return stack;
            };
            var err = new Error;
            Error.captureStackTrace(err, arguments.callee);
            var stack = err.stack;
            Error.prepareStackTrace = orig;
            return " line:" + stack[0].getLineNumber() + " ";
        }
    });
}

exports.newLogger = function (name) {
    var logger = {};
    logger._name = name;
    _.each(levels, function (level) {
        logger[level] = function (message, info) {
            let t = new Date() + ' ' +this._name + ':' + info + ' ' + message;
            console[level](t);
        }
    });

    return logger;
};

