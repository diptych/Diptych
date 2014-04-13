module.exports = function(app){
    var vote = require('../app/controllers/vote')
    ,   photos = require('../app/controllers/photos')
    ,   home = require('../app/controllers/home')
	,   list = require('../app/controllers/scope')

    //home route
    app.get('/', photos.render);
    app.get('/index', photos.render);
    app.get('/photo/next', photos.next);
    app.get('/photo/pair', photos.pair);
    app.get('/photo/pick/:count', photos.pick);

    // Three primary user interactions for photo diptych
    app.get('/keep/:winner/:looser', vote.keep)
    app.get('/toss/:partner1/:partner2', vote.toss)
    app.get('/pair/:partner1/:partner2', vote.pair)

	app.get('/scope', list.scope);


};
