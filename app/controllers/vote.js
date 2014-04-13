var db = require("../../config/database.js")
,   Q = require('q')
,   images = db.images
,   users = db.users
;



/**
 * Added entry to winning and losing images
 * @param  {Object} request  expects winning id and losing
 * @param  {Object} response response object
 * @return {[Image, Image]}  returns winning image with new pair
 */
exports.keep = keep;
function keep( request, response ){
    var winner = {
        id: request.params.winner
    ,   query: { _id: request.params.winner }
    ,   defer: Q.defer()
    }
    ,   looser ={
        id: request.params.looser
    ,   query: { _id: request.params.looser }
    ,   defer: Q.defer()
    }

    images.find(winner.query, function(error, results){
        var image = results.pop()
        image.wins.push(looser.id)
        images.update(winner.query, image, function(error, results){
           winner.defer.resolve(image)
        })
    })

    images.find(looser.query, function(error, results){
        var image = results.pop()
        image.losses.push(winner.id)
        images.update(looser.query, image, function(error, results){
           looser.defer.resolve(image)
        })
    })

    Q.all([winner.defer.promise, looser.defer.promise]).then(function(results){
        response.send( {
            winner: results[0]
        ,   looser: results[1]
        } )
    })
}

exports.toss = toss;
function toss( request, response ){
    var firstImage = {
        id: request.params.partner1
    ,   query: { _id: request.params.partner1 }
    ,   defer: Q.defer()
    }
    ,   secondImage ={
        id: request.params.partner2
    ,   query: { _id: request.params.partner2 }
    ,   defer: Q.defer()
    }

    images.find(firstImage.query, function(error, results){
        var image = results.pop()
        image.tosses.push(secondImage.id)
        images.update(firstImage.query, image, function(error, results){
           firstImage.defer.resolve(image)
        })
    })

    images.find(secondImage.query, function(error, results){
        var image = results.pop()
        image.tosses.push(firstImage.id)
        images.update(secondImage.query, image, function(error, results){
           secondImage.defer.resolve(image)
        })
    })

    Q.all([firstImage.defer.promise, secondImage.defer.promise])
    .then(function(results){
        response.send( results )
    })
}

exports.pair = pair;
function pair( request, response ){
    var firstImage = {
        id: request.params.partner1
    ,   query: { _id: request.params.partner1 }
    ,   defer: Q.defer()
    }
    ,   secondImage ={
        id: request.params.partner2
    ,   query: { _id: request.params.partner2 }
    ,   defer: Q.defer()
    }

    images.find(firstImage.query, function(error, results){
        var image = results.pop()
        image.pairs.push(secondImage.id)
        images.update(firstImage.query, image, function(error, results){
           firstImage.defer.resolve(image)
        })
    })

    images.find(secondImage.query, function(error, results){
        var image = results.pop()
        image.pairs.push(firstImage.id)
        images.update(secondImage.query, image, function(error, results){
           secondImage.defer.resolve(image)
        })
    })

    Q.all([firstImage.defer.promise, secondImage.defer.promise])
    .then(function(results){
        response.send( results )
    })
}

exports.choose = function( request, response ){
    console.log("vote.choose called");
    var winner, looser;
    var imageWin = { _id: request.params.winner }
    var imageLose = { _id: request.params.looser }

    images.find(imageWin, function(error, results){
        winner = results.pop()
        winner.wins += 1;
        images.update( imageWin, winner, function( error, results ){
            images.find(imageLose, function(error, results){
                looser = results.pop()
                looser.loses += 1;
                images.update( imageLose, looser, function(error, results){
                    response.send( winner, looser );
                })
            })
        })
    })
}

	//homepage rendering protocol
exports.show = function( request , responce){
    console.log("vote.win called");
    debugger;
    //console.log('request received at: ' + request.path);
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
			responce.render('home', {image: displayImage, title:'Diptych ~ Better Visuals'});
		});
	});
}
