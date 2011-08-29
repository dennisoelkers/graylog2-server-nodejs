var HostMatcher = function(value) {
	this.value = value;
}
HostMatcher.prototype.matches = function(msg) { return false; }
HostMatcher.prototype.toString = function() { return('HostMatcher: <value: ' + this.value + '>'); }
module.exports = HostMatcher;