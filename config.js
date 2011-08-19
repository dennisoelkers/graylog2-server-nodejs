function config() {
	return {
		"db" : {
			"host" : "localhost",
			"port" : 27017,
			"name" : "nodejstest",
			"collection" : "messages"
		},
		"debug_port" : 2342,
		"gelf_port" : 12201
	}
}

exports.config = config;