// Example model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema
;

var PhotoSchema = new Schema({
  title: String,
  url: String,
  text: String
});

PhotoSchema.virtual('date')
  .get(function(){
    return this._id.getTimestamp();
  });

mongoose.model('Photo', PhotoSchema);


// var Sequelize = require('sequelize-postgres').sequelize