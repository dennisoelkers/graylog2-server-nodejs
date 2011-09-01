var HostCounter = require('./message_processing/host_counter');
var MessageProcessor = require('./message_processing/message_processor');
var IndexSubmitter = require('./index_submitter');

var Worker = function(p_queue, p_datastorage) {
	this.datastorage = p_datastorage;
	this.queue = p_queue;
	this.hostCounter = new HostCounter(this.datastorage.db);
	this.messageProcessor = new MessageProcessor(this.datastorage.db);
	this.indexer = new IndexSubmitter();
	
	var c_datastorage = this.datastorage;
	var c_hostCounter = this.hostCounter;
	var c_messageProcessor = this.messageProcessor;
	var c_indexer = this.indexer;
	
	this.queue.emitter.on('enqueue', function(msg) {
		if (c_messageProcessor.process(msg)) {
			c_datastorage.add(msg);
			c_indexer.add(msg);
			c_hostCounter.increase(msg['host']);
		}
	});
}

Worker.prototype = {
	datastorage: undefined,
	queue: undefined
};

module.exports = Worker;
