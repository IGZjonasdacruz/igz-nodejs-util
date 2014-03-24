
var redis = require('redis');
var config = require('./config').redis;
var debug = require('debug')('igz-util.redis');

/**
 * Returns always the same redis-client instance
 */
var client;

function getClient () {

	if ( client === undefined ) {
		client = redis.createClient(config.port, config.host, config.options);
		client.on('error', function (err) {
			console.error(err); // TODO best way to handling errors
		});
	}

	return client;
}

module.exports = getClient;
