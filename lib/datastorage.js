var mongodb = require('mongodb');

var DataStorage = function(config) {
	this.server = new mongodb.Server(config['host'], config['port'], {});
	this.db = new mongodb.Db(config['name'], this.server, {native_parser:true});
	this.collection = config['collection'];
	this.db.open(function(err, db) {
		if(err) throw err;
	});
}

DataStorage.prototype.add = function(msg) {
	console.log('add() called');
	console.log('this.db: ' + this.db + ' this.collection: ' + this.collection);
	var collection = this.collection;
	this.db.createCollection(collection, {}, function (err, c) {
		if (err) throw err;
		c.insert(msg);
	});
}

module.exports = DataStorage;