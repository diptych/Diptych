module.exports = function(app){

	//home route
	var vote = require('../app/controllers/vote');
	app.get('/', vote.show);
    // Three primary user interactions for photo diptych
    app.get('/keep/:winner/:looser', vote.keep )
    app.get('/toss/:partner1/:partner2', vote.toss )
    app.get('/pair/:partner1/:partner2', vote.pair )

	var home = require('../app/controllers/home');
	app.get('/index', vote.show);

	var photos = require('../app/controllers/photos');
	// app.get('/photos', photos.get );
	app.get('/photos', photos.diptych );

	var gallery = require('../app/controllers/gallery');
	app.get('/gallery', gallery.list);
	var rank = require('../app/controllers/gallery');
	app.get('/rank', gallery.rank);

};
