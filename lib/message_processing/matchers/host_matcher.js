var HostMatcher = function(value) {
	this.value = value;
}
HostMatcher.prototype.matches = function(msg) { return msg['host'] === this.value; }
HostMatcher.prototype.toString = function() { return('HostMatcher: <value: ' + this.value + '>'); }
module.exports = HostMatcher;