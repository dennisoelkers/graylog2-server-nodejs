var FacilityMatcher = function(value) {
	this.value = value;
}

FacilityMatcher.prototype.matches = function(msg) {
	return (msg['facility'] === this.value);
}
module.exports = FacilityMatcher;