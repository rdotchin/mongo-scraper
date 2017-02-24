const cheerio = require('cheerio');
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

//create a model 
var News = mongoose.model('News', newsSchema);

/*===============================ROUTES======================================*/
module.exports= function(app){
	app.get('/', function(req, res){
		res.render('index');
	});

	app.get('/saved', function(req, res){
		res.render('saved');
	});

	app.get('/scrape', function(req, res){

		console.log(res);
		res.redirect('/');
	});

};