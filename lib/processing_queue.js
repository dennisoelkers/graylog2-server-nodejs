var EventEmitter = require('events').EventEmitter;

var ProcessingQueue = function() {
	this.emitter = new EventEmitter();
	this.emitter.on('enqueue', function(message) {
		console.log("Enqueued message: " + message);
	});
	this.emitter.on('dequeue', function(message) {
		console.log('Dequeued message: ' + message);
	});
	this.queue = [];
}

ProcessingQueue.prototype = {
	enqueue: function(msg) {
		this.emitter.emit('enqueue', msg);
		this.queue.push(msg);
	},
	
	dequeue: function() {
		msg = this.queue.shift();
		this.emitter.emit('dequeue', msg);
		return msg;
	},
	
	emitter: undefined
};

module.exports = ProcessingQueue;

