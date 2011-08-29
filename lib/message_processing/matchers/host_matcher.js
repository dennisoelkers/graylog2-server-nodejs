var HostMatcher = function(value) {
	this.value = value;
}
HostMatcher.prototype.matches = function(msg) { return true; }
module.exports = HostMatcher;