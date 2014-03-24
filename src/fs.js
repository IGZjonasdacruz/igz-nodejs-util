var fs = require('fs');
var path = require('path');

function rmDir (dirPath) {
	var files = fs.readdirSync(dirPath);
	if (files.length > 0) {
		
		var i, len, filePath
		for (i = 0, len = files.length; i < len; i++) {
			filePath = path.join(dirPath, '/' + files[i]);

			if ( fs.statSync(filePath).isFile() ) {
				fs.unlinkSync(filePath);
			} else {
				rmDir(filePath);
			}
		}
	}

	fs.rmdirSync(dirPath);
};

module.exports = {
	rmDir : rmDir
};
