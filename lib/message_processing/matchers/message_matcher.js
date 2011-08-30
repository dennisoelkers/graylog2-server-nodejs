var MessageMatcher = function(value) {
	this.value = value;
	this.regexp = new RegExp(value);
}

MessageMatcher.prototype.matches = function(msg) {
	return (this.regexp.exec(msg['short_message']) || this.regexp.exec(msg['full_message']));
}
module.exports = MessageMatcher;