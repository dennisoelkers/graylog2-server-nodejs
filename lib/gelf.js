var Buffer = require('buffer').Buffer;
var zlib = require('zlib');

function decode(buf) {
	return JSON.parse(zlib.inflate(buf));
}

exports.decode = decode;
