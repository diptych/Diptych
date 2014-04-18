var mongoose = require('mongoose'),
  User = mongoose.model('User');

exports.index = function(req, res){
  User.find(function(err, articles){
    if(err) throw new Error(err);
    res.render('home/index', {
      title: 'Diptych',
      articles: articles
    });
  });
};