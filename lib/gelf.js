var Buffer = require('buffer').Buffer;
var zlib = require('zlib');

function decode(buf) {
	return JSON.parse(zlib.inflate(buf));
}

function encode(struc) {
	struc['version'] = '1.0';
	json = new Buffer(JSON.stringify(struc));
	comp = zlib.deflate(json);
	return comp;
}

exports.decode = decode;
exports.encode = encode;
