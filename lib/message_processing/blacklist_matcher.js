var BlacklistMatcher = function() {
}
BlacklistMatcher.prototype.blacklisted = function(msg) { 
	return false;
}
module.exports = BlacklistMatcher;