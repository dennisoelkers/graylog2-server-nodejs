var config = require('./config').config();
var debug_port = require('./lib/debug_port');
var DataStorage = require('./lib/datastorage');
var gelf_listener = require('./lib/gelf_listener');
var ProcessingQueue = require('./lib/processing_queue');
var Worker = require('./lib/worker');
var server = {};

dataStorage = new DataStorage(config['db']);
processingQueue = new ProcessingQueue();
gelf_listener.start(config['gelf_port'], processingQueue);
worker = new Worker(processingQueue, dataStorage);

debug_port.start(config['debug_port'], server);

server['datastorage'] = dataStorage;
server['gelf_listener'] = gelf_listener;
server['debug_port'] = debug_port;
server['worker'] = worker;
