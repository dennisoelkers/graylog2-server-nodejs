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

StreamMatcher.prototype.matching_streams = function(msg) {
	var streams = [];
	for (var stream in this.streams) {
		if (false)
			streams.push(stream);
	}
	return streams;
}

module.exports = StreamMatcher;