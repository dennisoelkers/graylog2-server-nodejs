var logger = require('log4js').getLogger();

var MessageProcessor = function() {
}

MessageProcessor.prototype.process = function(msg) {
	logger.debug("Returning true for message " + msg);
	return true;
}

module.exports = MessageProcessor;

