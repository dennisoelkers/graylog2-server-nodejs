var GELF = require('./lib/gelf');
var dgram = require('dgram');
var client = dgram.createSocket("udp4");

var message = {
	host : 'host.domain.tld',
	short_message : 'this is a short test message',
	full_message : 'this is a long test message',
	facility : 'testsender.js'
}

var stats = {
	count: 0
}

var buf = GELF.encode(message)
setInterval(function(stats) {
	console.log("Count: " + stats['count']);
}, stats);

//setInterval(function(client, buf, stats) {
while(true) {
	client.send(buf, 0, buf.length, 12201, 'localhost');
	stats['count'] += 1;
	console.log(stats['count']);
}
//}, 1, client, buf, stats);
