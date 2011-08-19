var dgram = require("dgram");
var server = dgram.createSocket("udp4");
var gelf = require("./gelf");
var counter = 0;
var datastorage;

function start(port, p_datastorage) {
	server.on("message", function (msg, rinfo) {
		message = gelf.decode(msg);
		console.log("server got: " + message.toString() + " from " +
		  rinfo.address + ":" + rinfo.port);
		counter = counter + 1;

		datastorage.add(msg);
		console.log("count: " + counter);
	});

	server.on("listening", function () {
	  var address = server.address();
	  console.log("server listening " +
	      address.address + ":" + address.port);
	});

	datastorage = p_datastorage;
	server.bind(port);
}

exports.start = start;
