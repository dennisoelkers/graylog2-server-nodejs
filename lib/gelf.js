var Buffer = require('buffer').Buffer;
var logger = require('log4js').getLogger();
var zlib = require('zlib');
var Binary = require('binary');

function decode(buf, callback) {
	var gelf_header = Binary.parse(buf).word16lu('chunk_magic').vars;
	switch(gelf_header['chunk_magic']) {
		case 40056:
			zlib.inflate(buf, function gelfDecodeInflateCallback(err, data) {
				if (!err)
					data = JSON.parse(data);
				callback(err, data);
			});
			break;
		case 35615:
			logger.error('got GZIP message, trying to unzip');
			zlib.gunzip(buf, function gelfDecodeGunzipCallback(err, data) {
				if (!err)
					data = JSON.parse(data);
				callback(err, data);
			});
			break;
	}	
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
