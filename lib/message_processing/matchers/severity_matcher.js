var SeverityMatcher = function(value) {
	this.value = value.toString();
}

SeverityMatcher.prototype.matches = function(msg) {
	return (msg['level'].toString() === this.value);
}
module.exports = SeverityMatcher;