var ElasticSearchClient = require('elasticsearchclient');
var config = require('../config').config()['indexer'];
var logger = require('log4js').getLogger();
var util = require('util');

var IndexSubmitter = function() {
	this.client = this.client || new ElasticSearchClient({ host : config['host'], port : config['port'] });
}

IndexSubmitter.prototype.add = function(msg) {
	logger.debug('Submitting msg ' + util.inspect(msg) + ' to indexer ' + util.inspect(this.client));
	this.client.index(config['index'], config['type'], msg).exec();
}

module.exports = IndexSubmitter;