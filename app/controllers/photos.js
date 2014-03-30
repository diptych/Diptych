var mongoose = require('mongoose'),
	async = require('async'),
	_ = require('lodash'),
	Photo = mongoose.model('Photo'),
	globule = require('globule'),
	config = require('../../config/config')

	// db and stuff
	db = require("../../config/database.js"),
	images = db.images,
	users = db.users
;

exports.get = function(req, res){
    var photos = globule.find(config.root + '/public/**/*.jpg')
    photos = _.map( _.sample(photos, 2), function( photoPath ){
        return 'images/starter/'+photoPath.split('/').pop();
    })
    res.send(200, JSON.stringify( photos ) );
};

exports.diptych = function( request, response ){
	images.find({}, function(err, allImages){
		// Find the current user
		users.find({ip: request.ip},function(err, u){
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
			response.send(displayImage)
		});
	})
} 
