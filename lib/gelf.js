var Buffer = require('buffer').Buffer;
var logger = require('log4js').getLogger();
var zlib = require('zlib');
var binary = require('binary');

function decode(buf) {
	gelf_header = Binary.parse(msg).word16lu('chunk_magic').vars;
	var json;
	switch(gelf_header['chunk_magic']) {
		case '40056':
			json = zlib.inflate(buf);
			break;
		case '35615':
			logger.error('got GZIP message, trying to unzip');
			json = zlib.Gunzip(buf);
			break;
	}
	
	return JSON.parse(json);
}

function encode(struc) {
	struc['version'] = '1.0';
	struc['created_at'] = new Date().getTime() / 1000;
	struc['gelf'] = true;
	json = new Buffer(JSON.stringify(struc));
	comp = zlib.deflate(json);
	return comp;
}

exports.decode = decode;
exports.encode = encode;
