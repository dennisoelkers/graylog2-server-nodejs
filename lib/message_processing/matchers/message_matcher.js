var MessageMatcher = function(value) {
	this.value = value;
}

MessageMatcher.prototype.matches = function(msg) { return true; }
module.exports = MessageMatcher;