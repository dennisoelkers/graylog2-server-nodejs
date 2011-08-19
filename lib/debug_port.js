var net = require("net"),
    repl = require("repl");

function start(port, ctx) {
	connections = 0;

	net.createServer(function (socket) {
	  connections += 1;
	  repl.start("node via TCP socket> ", socket).context.debug = ctx;
	}).listen(port);	
}

exports.start = start;
