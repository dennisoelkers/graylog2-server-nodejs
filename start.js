var config = require('./config').config();
var debug_port = require('./lib/debug_port');
var DataStorage = require('./lib/datastorage');
var gelf_listener = require('./lib/gelf_listener');
var ProcessingQueue = require('./lib/processing_queue');
var Worker = require('./lib/worker');
var server = {};

var log4js = require('log4js');
var logger = log4js.getLogger();

dataStorage = new DataStorage(config['db']);
processingQueue = new ProcessingQueue();
gelf_listener.start(config['gelf_port'], processingQueue);
worker = new Worker(processingQueue, dataStorage);

debug_port.start(config['debug_port'], server);

server['datastorage'] = dataStorage;
server['gelf_listener'] = gelf_listener;
server['debug_port'] = debug_port;
server['worker'] = worker;
server['server_values'] = new require('./lib/server_values')(dataStorage.db);

var os = require('os');
var util = require('util');
setInterval(function() {
	logger.debug("Memory: " + os.freemem()/1024/1024 + '/' + os.totalmem()/1024/1024);
	logger.debug('Load: ' + os.loadavg());
	logger.debug('Process Memory: ' + util.inspect(process.memoryUsage()));
}, 5000);
