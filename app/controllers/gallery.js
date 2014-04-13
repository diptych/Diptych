var db = require("../../config/database.js"),
	images = db.images,
	users = db.users;

// gallery render all the photos currently in the database. There is no
// logic, it just shows everything.
exports.list = list
function list(request, responce){
	console.log("gallery.list called");
	responce.render('home/gallery');
};


exports.rank = rank
function rank(request, responce){
	images.find({}, function(err, rankImages){
		console.log(rankImages.length);
		// Find the current user
		//sort images based on a simple weight | Intended to be relative comparison at some point
		rankImages.sort(function(picture1, picture2){
			var weightedResults =
				(picture2.wins.length - 2 
					* picture2.losses.length/3) 
				- (picture1.wins.length - 2 
					* picture1.losses.length/3);
			return weightedResults;
		});
		responce.send(rankImages);
	});
}