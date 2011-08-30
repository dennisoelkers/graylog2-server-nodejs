var GELF = require('./lib/gelf');
var dgram = require('dgram');
var client = dgram.createSocket("udp4");

var message = {
	host : 'host.domain.tld',
	short_message : 'this is a short test message',
	full_message : 'this is a long test message',
	facility : 'testsender.js',
	file : 'testsender.js',
	line : 42,
	level : 3
}

var stats = {
	count: 0
}

setInterval(function(stats) {
	console.log("Count: " + stats['count']);
}, 2000, stats);

/*setInterval(function(client, stats) {
while(true) {*/
	message['created_at'] = new Date().getTime() / 1000;
	var buf = GELF.encode(message)
	client.send(buf, 0, buf.length, 12201, 'localhost');
	stats['count'] += 1;
	console.log(stats['count']);
/*}
}, 100, client, stats);*/
