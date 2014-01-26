module.exports = function(app){

	//home route
	var home = require('../app/controllers/home');
	app.get('/', home.index);

    var photos = require('../app/controllers/photos')
    app.get('/photos', photos.get )

};
