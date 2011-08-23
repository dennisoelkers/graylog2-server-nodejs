var HostCounter = require('./message_processing/host_counter');

var Worker = function(p_queue, p_datastorage) {
	//console.log('queue: ' + p_queue, ' datastorage: ' + p_datastorage);
	this.datastorage = p_datastorage;
	//this.datastorage.add({"foo" : 42});
	this.queue = p_queue;
	this.hostCounter = new HostCounter(this.datastorage.db);
	var c_datastorage = this.datastorage;
	var c_hostCounter = this.hostCounter;
	this.queue.emitter.on('enqueue', function(msg) {
		c_datastorage.add(msg);
		c_hostCounter.increase(msg['host']);
	});
}

Worker.prototype = {
	datastorage: undefined,
	queue: undefined
};

module.exports = Worker;
