module.exports = function(app){

	//home route
	var vote = require('../app/controllers/vote');
	app.get('/', vote.show);
	app.get('/image/:id/:action?', vote.win )
    app.get('/choose/:winner/:looser/', vote.choose )

	var home = require('../app/controllers/home');
	app.get('/index', vote.show);

	var photos = require('../app/controllers/photos');
	// app.get('/photos', photos.get );
	app.get('/photos', photos.diptych );

	var list = require('../app/controllers/scope');
	app.get('/scope', list.scope);


};
