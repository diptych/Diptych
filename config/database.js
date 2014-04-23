// Require nedb module
var fs = require('fs')
,	dataStore = require('nedb')
,	dbox  = require("dbox")
,	mongo = require("mongodb")
,	mongoose = require("mongoose")
,	http = require("http")
,	config = require('./config.js')


// MongoDB functionality
mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.port);
});
db.once('open', function(callback){
	//console.log(db); // Debug database display
	console.log("Diptych connected to database: "+db.name);
})


// To be replaced by mongodb
// Create nedb for photos and users leveraging autoload
var images = new dataStore({ filename: __dirname + "/data/images", autoload: true })
,   users = new dataStore({ filename: __dirname + "/data/users", autoload: true})
;
//  Create unique filename for photos and user ip
images.ensureIndex({fieldName: 'name', unique: true});
users.ensureIndex({fieldName: 'ip', unique: true});
// Read filesystem photos into nedb objects
var  defaultImages = fs.readdirSync('./public/img/starter');
// Generate datastructure for images
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
