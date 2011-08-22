var Worker = function(p_queue, p_datastorage) {
	//console.log('queue: ' + p_queue, ' datastorage: ' + p_datastorage);
	this.datastorage = p_datastorage;
	//this.datastorage.add({"foo" : 42});
	this.queue = p_queue;
	var c_datastorage = this.datastorage;
	this.queue.emitter.on('enqueue', function(msg) {
		c_datastorage.add(msg);
	});
}

Worker.prototype = {
	datastorage: undefined,
	queue: undefined
};

module.exports = Worker;
