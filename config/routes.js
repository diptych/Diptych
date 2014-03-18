module.exports = function(app){

	//home route
	var vote = require('../app/controllers/vote');
	app.get('/', vote.show);

	var home = require('../app/controllers/home');
	app.get('/index', vote.show);

	var photos = require('../app/controllers/photos');
	app.get('/photos', photos.get );

	var list = require('../app/controllers/scope');
	app.get('/scope', list.scope);

};
