var debug = require('debug')('igz-util.dao');
var mongodb = require('./mongodb');
var ObjectID = require('mongodb').ObjectID;

function deleteAll (collectionName, callback) {
	mongodb(function(err, db) {
		if (err) {
			return callback(err);
		}

		if ( process.env.CONFIG === 'local' || process.env.CONFIG === 'test' ) {
			
			debug('Delete all "' + collectionName + '"');

			db.collection(collectionName).remove({}, function(err, numberRemoved) {
				if (err) {
					return callback(err);
				}
				callback();
			});
		} else {
			callback({name:'Dao Error', message: 'deleteAll is only enabled with CONFIG="local" or CONFIG="test"'});
		}
	});
};

function get (collectionName, criteria, options, callback) {
	mongodb(function(err, db) {
		if (err) {
			return callback(err);
		}
		db.collection(collectionName).findOne(criteria, options, callback);
	});
}

function insert (collectionName, data, callback) {
	mongodb(function(err, db) {
		if (err) {
			return callback(err, null);
		}
		db.collection(collectionName).insert(data, {w: 1}, callback);
	});
}

function find (collectionName, criteria, fields, options, callback) {
	mongodb(function(err, db) {
		if (err) {
			return callback(err, null);
		}
		db.collection(collectionName).find(criteria, fields, options, function (err, cursor) {
			if (err) {
				return callback(err, null);
			}
			cursor.toArray(function(err, items) {
				if (err) {
					return callback(err, null);
				}
				
				callback(null, items);
			});
		});
	});
}

function getByIds (collectionName, ids, fields, options, callback) {
	mongodb(function(err, db) {
		if (err) {
			return callback(err, null);
		}

		var objecIds = [];
		for (var i = 0, len = ids.length; i < len; i++) {
			objecIds.push( new ObjectID(ids[i]) );
		}

		db.collection(collectionName).find({_id: { $in: objecIds }}, fields, options, function (err, cursor) {
			if (err) {
				return callback(err, null);
			}
			cursor.toArray(function(err, items) {
				if (err) {
					return callback(err, null);
				}
				
				callback(null, items);
			});
		});
	});
}

/**
 * Find the doc by 'id' and set all fields defined in 'data'.
 * Callback returns the doc updated or error if the doc not exists.
 * 
 * @param  {string}   collectionName
 * @param  {string|ObjectID}   id
 * @param  {object}   data
 * @param  {Function} callback function(err, doc) {}
 * @return {void}
 */
function setById (collectionName, id, data, callback) {
	mongodb(function(err, db) {
		if (err) {
			return callback(err, null);
		}

		if ( typeof id === 'string' ) {
			try {
				id = new ObjectID(id);
			} catch (err) {
				return callback({name: 'Dao Error', message: 'invalid id format'}, null);
			}
		}

		db.collection(collectionName).findAndModify({_id: id}, [['_id', 1]], { $set: data }, {new : true}, function (err, result) {
			if ( err ) {
				return callback(err, null);
			}

			if ( !result ) {
				return callback({name: 'Dao Error', message: 'doc not found for id = "' + id.toString() + '" in "' + collectionName + '" collection'}, null);
			}

			callback(null, result);
		});
	});
}

function findAndModify (collectionName, criteria, sort, update, options, callback) {
	mongodb(function(err, db) {
		if (err) {
			return callback(err, null);
		}
		db.collection(collectionName).findAndModify(criteria, sort, update, options, callback);
	});
}

function update (collectionName, find, set, options, callback) {
	mongodb(function(err, db) {
		if (err) {
			return callback(err, null);
		}
		db.collection(collectionName).update(find,set,options,callback);
	});
}

function ensureIndex (collectionName, criteria, options, callback) {
	mongodb(function(err, db) {
		if (err) {
			return callback(err, null);
		}
		db.collection(collectionName).ensureIndex(criteria, options, callback);
	});
}

function getCursor(collectionName, callback){
	mongodb(function(err, db) {
		if (err) {
			return callback(err, null);
		}
		callback( db.collection(collectionName).find({}) );
	});	
}

module.exports = {
	deleteAll: deleteAll,
	get: get,
	getByIds: getByIds,
	insert: insert,
	update: update,
	find: find,
	findAndModify: findAndModify,
	setById: setById,
	ensureIndex:ensureIndex,
	getCursor:getCursor
}
