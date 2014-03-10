var db = require("../../config/database.js"),
	images = db.images,
	users = db.users;

// scope render all the photos currently in the database. There is no logic, it just shows everything.
exports.scope = function(req, res){
	images.find({}, function(err, allImages){
		// Find the current user
		//sort images based on a simple weight | Intended to be relative comparison at some point
		allImages.sort(function(p1, p2){
			return (p2.wins - 2*p2.loses/3) - (p1.wins - 2*p1.loses/3);
		});
		//render the scope template and pass the image json
		res.render('scope', {scope:allImages});
	});
};