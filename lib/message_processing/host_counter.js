var EventEmitter = require('events').EventEmitter;
var logger = require('log4js').getLogger();

var HostCounter = function(db, interval) {
	this.hosts = {}
	this.interval = interval || 5000;
	this.db = db;
	this.events = new EventEmitter();
	setInterval(function(counter) {counter.persistCounter()}, 5000, this);
}

HostCounter.prototype.increase = function(host, inc) {
	inc = inc || 1;
	this.hosts[host] = this.hosts[host] || 0;
	this.hosts[host] += inc;
	this.events.emit('host_update', host, inc);
}

HostCounter.prototype.persistCounter = function() {
	//console.log('persistCounter(): ' + this.hosts);
	for (key in this.hosts) {
		inc = this.hosts[key];
		this.db.createCollection('hosts', function(err, coll) {
			if (err) throw err;
			logger.debug('Persisting ' + key + ' value: ' + inc);
			coll.update({'host' : key}, {'$inc' : {'message_count' : inc}}, {upsert : true});
		});
		this.hosts[key] = 0;
	}
}

module.exports = HostCounter;
