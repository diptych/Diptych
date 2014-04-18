// Example model

var mongoose = require('mongoose')
,	Schema = mongoose.Schema;

var ImageSchema = new Schema({
	name: String,
	title: String,
	url: String,
	wins: Array,
	losses: Array,
	pairs: Array,
	tosses: Array
}
, 	{ _id: true });


ImageSchema.virtual('date')
  .get(function(){
    return this._id.getTimestamp();
  });

mongoose.model('Image', ImageSchema);