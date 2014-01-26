var mongoose = require('mongoose')
,   async = require('async')
,   _ = require('lodash')
,   Photo = mongoose.model('Photo')
,   globule = require('globule')
,   config = require('../../config/config')
;

exports.get = function(req, res){
    var photos = globule.find(config.root + '/public/**/*.jpg')
    photos = _.map( _.sample(photos, 2), function( photoPath ){
        return 'images/starter/'+photoPath.split('/').pop();
    })
    res.send(200, JSON.stringify( photos ) );
};
