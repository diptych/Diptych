var mongoose = require('mongoose'),
  User = mongoose.model('User');

exports.index = function(request, responce){
  User.find(function(err, articles){
    if(err) throw new Error(err);
    responce.render('home/index', {
      title: 'Diptych',
      articles: articles
    });
  });
};