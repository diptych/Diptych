// Require nedb module
var fs = require('fs')
,	dataStore = require('nedb')
, 	Dropbox = require("dropbox")
,	dbox  = require("dbox")
,	mongo = require("mongodb")
,	mongoose = require("mongoose");


// Read Dropbox keys into the configuration protocol.
function readContent(targetFile){
	fs.readFile( targetFile, 'utf8', function read(err, data){
		if (err) {
			throw err;
		}
		content = data;
		processFile();
	});
	function processFile(){
		return content
	}
}

// populate dropbox helper app with secret keys
var appKey = readContent('./dropbox_app_key.txt');
var appSecret = readContent('./dropbox_app_secret.txt');
var app   = dbox.app({ "app_key" : appKey, "app_secret" : appSecret });


// Connect to MongoDB
mongo.connect('mongodb://localhost/diptych-development', {auto_reconnect : true}, function(err, db) { 
	if (err){
		
	}
	return 
});

// create nedb for photos and users leveraging autoload
var images = new dataStore({ filename: __dirname + "/data/images", autoload: true })
,   users = new dataStore({ filename: __dirname + "/data/users", autoload: true})
;

//  Create unique filename for photos and user ip
images.ensureIndex({fieldName: 'name', unique: true});
users.ensureIndex({fieldName: 'ip', unique: true});


// Read filesystem photos into nedb objects
var  defaultImages = fs.readdirSync('./public/img/starter');

defaultImages.forEach(function(image){
	images.insert({
		name: image,
        wins: [],
        losses: [],
        pairs: [],
        tosses: []
	})
});

// Make users and images universally available
module.exports = {
	images:images,
	users:users
};
