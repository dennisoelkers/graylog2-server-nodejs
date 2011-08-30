var GELF = require('../../gelf');
var dgram = require('dgram');

var GelfForwarder = function(value) {
	this.host = value['host'];
	this.port = value['port'];
}
GelfForwarder.prototype.forward = function(msg) { 
	var buf = GELF.encode(msg);
	var client = dgram.createSocket('udp4');
	client.send(buf, 0, buf.length, this.port, this.host);
	client.close();
	delete client;
	return true;
}
GelfForwarder.prototype.toString = function() { return('GelfForwarder : <value: ' + this.value + '>'); }
module.exports = GelfForwarder;