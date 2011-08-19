var config = require('./config').config();
var debug_port = require('./lib/debug_port');
var datastorage = require('./lib/datastorage');
var gelf_listener = require('./lib/gelf_listener');
var ProcessingQueue = require('./lib/processing_queue');
var server = {};

datastorage.init(config['db']);
processingQueue = new ProcessingQueue(datastorage);
gelf_listener.start(config['gelf_port'], processingQueue);
debug_port.start(config['debug_port'], server);

server['datastorage'] = datastorage;
server['gelf_listener'] = gelf_listener;
server['debug_port'] = debug_port;
