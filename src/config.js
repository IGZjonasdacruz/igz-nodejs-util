var debug = require('debug')('i60-config');
var filename = process.env.CONFIG;

if ( !filename ) {
	console.error('***ERROR*** you have to define the environment variable CONFIG to specify the running environment: "CONFIG=local node app"');
	return process.exit(1);
}

var config = {};

function loadConfigs (filenames) {
	var i, len, configPath, configJson;
	for (i = 0, len = filenames.length; i < len; i++) {
		configPath = filenames[i];
		configJson = require(configPath);
		addValuesToConfig(configJson)
		debug('Configuration loaded: "' + filename + '"');
	}
}

function addValuesToConfig (newConfig) {
	for (var prop in newConfig) {
		config[prop] = newConfig[prop];
	}
}

loadConfigs(['app', filename]);


module.exports = config;
