var logger = require('log4js').getLogger();
var util = require('util');

var matcherMap = {
	'1' : require('./matchers/message_matcher'),
	'2' : require('./matchers/host_matcher')
}

function updateStreams(streams, db) {
	logger.debug('streams are: ' + util.inspect(streams));
	db.collection('streams', function(err, c) {
		if (err) throw err;
		c.find({}, function(err, cursor) {
			for (key in streams) { delete streams[key]; }
			if (err) throw err;
			cursor.each(function(err, doc) {
				if (!doc || !doc.streamrules) return;
				//logger.debug('Iterating over doc: ' + util.inspect(doc));
				if (err) throw err;
				var stream = streams[doc['_id']] = {};
				/*logger.debug('1 stream is: ' + util.inspect(stream));
				logger.debug('2 streams is: ' + util.inspect(streams));*/
				for (index in doc.streamrules) {
					var rule = doc.streamrules[index];
					//logger.debug('Iterating over streamrule: '+util.inspect(rule));
					if (!stream[rule.rule_type]) {
						stream[rule.rule_type] = [];
					}
					try {
						stream[rule.rule_type].push(new matcherMap[rule.rule_type](rule.value));
					} catch(err) {
						logger.warn("Invalid type of Streamrule " + rule['_id'] + ": " + err);
					}
					//stream[rule.rule_type].push(rule.value);
					/*logger.debug('3 stream is: ' + util.inspect(stream));
					logger.debug('4 stream is: ' + util.inspect(streams));*/
				}
			});
		});
	});
}

var StreamMatcher = function(db) {
	this.db = db;
	this.streams = {};
	updateStreams(this.streams, this.db);
	setInterval(updateStreams, 5000, this.streams, this.db);
}

function rule_type_matches(msg, rules) {
	for (var rule_index in rules) {
		rule = rules[rule_index];
		logger.debug('Rule ' +  rule_index + ' matching? ' + rule.matches(msg));
		if (rule.matches(msg)) return true;
	}
	
	return false;
}

function stream_matches(msg, stream) {
	for (var rule_type in stream) {
		if (stream[rule_type].length == 0) break;
		if (!rule_type_matches(msg, stream[rule_type])) {
			logger.debug('Rule type ' + rule_type + ' caused abortion');
			return false;
		}
	}
	
	return true;
}

StreamMatcher.prototype.matching_streams = function(msg) {
	var streams = [];
	for (var stream_id in this.streams) {
		logger.debug('Checking Stream ' + stream_id);
		var match = false;
		var stream = this.streams[stream_id];
		if (stream_matches(msg, stream)) {
			logger.debug('Message matched stream ' + stream_id);
			var serialized_id = new this.db.bson_serializer.ObjectID(stream_id);
			streams.push(serialized_id);
		} else {
			logger.debug('Message does not match stream ' + stream_id);
		}
	}
	return streams;
}

module.exports = StreamMatcher;