var mongodb = require('mongodb');
var collection;
var db;

function init(config) {
	var db = new mongodb.Db(config['name'], new mongodb.Server(config['host'], config['port'], {}), {});

	db.open(function(err, db) {
		db.createCollection(config['collection'], {}, function(err, c) {
			if (err) throw err;
			console.log("coll2: " + c);
			collection = c;
		});
	});
}

function add(msg) {
	collection.insert(message, {});
}

exports.init = init;
exports.add = add;
