// Require nedb module
var dataStore = require('nedb'),
	fs = require('fs');

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
