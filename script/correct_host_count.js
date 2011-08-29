var config = require('../config').config();
var mongodb = require('mongodb');
var util = require('util');

var hosts = {};
var server = new mongodb.Server('127.0.0.1', 27017, {});
var db = new mongodb.Db('nodejstest', server, {native_parser:true});

db.open(function(err, db) {
	if(err) throw err;
	db.collection('hosts', function(err, coll) {
		if(err) throw err;
		coll.find(function(err, cursor) {
			if(err) throw err;
			cursor.each(function(err, h) {
				if(err) throw err;
				if (h === null)
					return;
				console.log('Checking host ' + h.host);
				db.collection('messages', function(err, m) {
					if(err) throw err;
					m.count({'host' : h['host']}, function(err, count) {
						if(err) throw err;
						if (h['message_count'] === count)
							return;
						coll.update({'host' : h['host']}, {'$set' : {'message_count' : count}});
						console.log('Updating host ' + h['host'] + ' to message count ' + count);
					});
				});
			});
		});
	});
});

