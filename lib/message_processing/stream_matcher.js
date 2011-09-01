var logger = require('log4js').getLogger();
var util = require('util');

var matcherMap = {
	'1' : require('./matchers/message_matcher'),
	'2' : require('./matchers/host_matcher'),
	'3' : require('./matchers/severity_matcher'),
	'4' : require('./matchers/facility_matcher'),
	'6' : require('./matchers/additional_fields_matcher')
}

var forwarderMap = {
	'gelf' : require('./forwarders/gelf_forwarder')
}

function updateStreams(streams, forwarders, db) {
	logger.debug('streams are: ' + util.inspect(streams));
	logger.debug('forwarders are: ' + util.inspect(forwarders));
	db.collection('streams', function(err, c) {
		if (err) throw err;
		c.find({}, function(err, cursor) {
			if (err) throw err;
			for (key in streams) { delete streams[key]; }
			for (key in forwarders) { delete forwarders[key]; }
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

				if (doc.forwarders && doc.forwarders.length > 0) {
					logger.debug('forwarders exist for stream: ' + doc['_id']);
					var f = forwarders[doc['_id']] = [];
					try {
						for (idx in doc.forwarders) {
							var forwarder = doc.forwarders[idx];
							logger.debug('Instantiating forwarder for type ' + util.inspect(forwarder));
							f.push(new forwarderMap[forwarder.endpoint_type](forwarder));
						}
					} catch(err) {
						logger.warn("Invalid type or parameters of Stream Forwarder " + forwarder + ": " + err);
					}
				}
			});
		});
	});
}

var StreamMatcher = function(db) {
	this.db = db;
	this.streams = {};
	this.forwarders = {};
	setTimeout(updateStreams, 0, this.streams, this.forwarders, this.db);
	setInterval(updateStreams, 5000, this.streams, this.forwarders, this.db);
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
			var forwarders = this.forwarders[stream_id];
			logger.debug('stream has ' + util.inspect(forwarders) + 'forwarders');
			if (forwarders && forwarders.length > 0) {
				for (idx in forwarders) {
					var forwarder = forwarders[idx];
					logger.debug('Logging Message using forwarder ' + util.inspect(forwarder));
					forwarder.forward(msg);
				}
			}
			var serialized_id = new this.db.bson_serializer.ObjectID(stream_id);
			streams.push(serialized_id);
		} else {
			logger.debug('Message does not match stream ' + stream_id);
		}
	}
	return streams;
}

module.exports = StreamMatcher;