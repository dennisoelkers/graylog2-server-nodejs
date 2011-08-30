var logger = require('log4js').getLogger();
var StreamMatcher = require('./stream_matcher');
var BlacklistMatcher = require('./blacklist_matcher');
var util = require('util');

var MessageProcessor = function(db) {
	this.db = db;
	this.streamMatcher = new StreamMatcher(db);
	this.blacklistMatcher = new BlacklistMatcher(db);
}

function isValidMessage(msg) {
	//valid = msg['facility'] and msg['level'] and msg['message']
	return valid;
}

MessageProcessor.prototype.process = function(msg) {
	logger.debug("Returning true for message " + msg);
	if (this.blacklistMatcher.blacklisted(msg)) {
		logger.debug("message is blacklisted - dropping");
		return false;
	}
	
	msg['deleted'] = false;
	
	logger.debug('message is not blacklisted, checking for streams');
	var streams = this.streamMatcher.matching_streams(msg);
	msg['streams'] = streams;
	logger.debug('processed message is ' + util.inspect(msg));
	return msg;
}

module.exports = MessageProcessor;

