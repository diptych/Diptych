var db = require("../../config/database.js"),
	images = db.images,
	users = db.users;


exports.win = function( request, response ){
	var query = {
			_id: request.params.id
		}

	images.find( query, function( error, results ){
		image = results.pop()

		switch( request.params.action ){
			case 'win':
				image.wins += 1
				break;
			case 'lose':
				image.loses += 1
				break;
			default:
				break;
		}

		images.update( query, image, function( error, results ){ 
			response.send( image )
		})
	})
}

	//homepage rendering protocol
exports.show = function(req,res){
		//console.log('request received at: ' + req.path);
		images.find({}, function(err, allImages){
			// Find the current user
			users.find({ip: req.ip},function(err, u){
				//console.log(allImages);
				// create the image array
				var votedImages = [];
				if(u.length == 1){
					votedImages = u[0].votes;
				}
				// Find the images the user has not voted on yet
				var notVotedImages = allImages.filter(function(image){
					return votedImages.indexOf(image._id) == -1;
				});
				var displayImage = null;

				if(notVotedImages.length > 0){
					// choose a random image from the array
					displayImage = drawTwo(notVotedImages);
				}

				/**
				 * Randomize array element order in-place.
				 * Using Fisher-Yates shuffle algorithm.
				 */
				function drawTwo(array) {
					for (var i = array.length - 1; i > 0; i--) {
						var j = Math.floor(Math.random() * (i + 1));
						var temp = array[i];
						array[i] = array[j];
						array[j] = temp;
					}
					//Create the array of the shuffles images
					var newArray = [];
					newArray[0] = array[0];
					newArray[1] = array[1];
					return newArray;
				}

				// trandsmit the display image image
				res.render('home', {image: displayImage, title:'Really Awesome Title'});
			});
		});
}