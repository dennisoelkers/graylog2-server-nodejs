var GELF = require('../../gelf');
var dgram = require('dgram');

var GelfForwarder = function(value) {
	this.host = value['host'];
	this.port = value['port'];
	this.client = dgram.createSocket('udp4');
}
GelfForwarder.prototype.forward = function(msg) { 
	var buf = GELF.encode(msg);
	this.client.send(buf, 0, buf.length, this.port, this.host);
	return true;
}
GelfForwarder.prototype.toString = function() { return('GelfForwarder : <value: ' + this.value + '>'); }
module.exports = GelfForwarder;