var mongodb = require('./mongodb');
var dao = require('./dao');
var config = require('./config');
var fs = require('./fs');
var redis = require('./redis');

module.exports = {
	mongodb: mongodb,
	dao: dao,
	config: config,
	fs: fs,
	redis: redis
};
