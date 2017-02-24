/*==========MONGOOSE=========================*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


mongoose.connect('mongodb://localhost/nytdb');

//create a schema
var newsSchema = Schema({
	headline: String,
	summary: String,
	link: String,
	img: String,
	notes: Array
});

//export the model
module.exports = mongoose.model('News', newsSchema);




