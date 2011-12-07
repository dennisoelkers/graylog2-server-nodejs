var logger = require('log4js').getLogger();
var dgram = require("dgram");
var server = dgram.createSocket("udp4");
var gelf = require("./gelf");
var counter = 0;
var queue;

function start(port, p_queue) {
	server.on("message", function (msg, rinfo) {
		try {
			message = gelf.decode(msg);
		} catch(err) {
			logger.error("Error parsing GELF message: " + err);
			return;
		}
		counter = counter + 1;

		queue.enqueue(message);
		//console.log("count: " + counter);
	});

	server.on("listening", function () {
	  var address = server.address();
	  logger.info("server listening " +
	      address.address + ":" + address.port);
	});

	queue = p_queue;
	server.bind(port);
}

exports.start = start;
