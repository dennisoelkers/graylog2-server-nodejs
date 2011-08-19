var config = require('./config').config();
var debug_port = require('./lib/debug_port');
var datastorage = require('./lib/datastorage');
var gelf_listener = require('./lib/gelf_listener');
var server = {};

server['datastorage'] = datastorage.init(config['db']);
server['gelf_listener'] = gelf_listener.start(config['gelf_port'], datastorage);
server['debug_port'] = debug_port.start(config['debug_port'], server);
