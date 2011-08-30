var util = require('util');

var ServerValues = function(db) {
	this.values = { 'startup_time' : new Date().getTime() / 1000,
		'pid' : process.pid,
		'jre' : 'Node.js version ' + process.version + ' on ' + process.platform,
		'graylog2_version' : 'node.js 0.0.1',
		'local_hostname' : 'localhost',
		'ping' : new Date().getTime() / 1000
	}

	this.db = db;

	setTimeout(update_server_values, 0, this.values, this.db);
	setInterval(update_server_values, 5000, this.values, this.db);
}

function update_server_values(values, db) {
	values['ping'] = new Date().getTime()/1000;
	
	db.createCollection('server_values', function(err, coll) {
		if (err) throw err;
		for (type in values) {
			if (type)
				coll.update({'type' : type}, {'$set' : {'value' : values[type]}}, {upsert : true});	
		}
	});
}

ServerValues.prototype.matches = function(msg) {
	return (this.matcher.exec(msg['_' + this.field]) != null);
}
module.exports = ServerValues;