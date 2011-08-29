var MessageMatcher = function(value) {
	this.value = value;
}

MessageMatcher.prototype.matches = function(msg) { return false; }
module.exports = MessageMatcher;