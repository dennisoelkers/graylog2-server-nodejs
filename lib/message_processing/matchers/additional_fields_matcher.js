var fieldsRe = new RegExp('(.+)=(.+)');

var AdditionalFieldsMatcher = function(value) {
	if (m = fieldsRe.exec(value) && m ) {
		this.field = m[1];
		this.matcher = new RegExp(m[2]);
	}
}

AdditionalFieldsMatcher.prototype.matches = function(msg) {
	return (this.matcher.exec(msg['_' + this.field]) != null);
}
module.exports = AdditionalFieldsMatcher;