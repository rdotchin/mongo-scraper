/*===========================GLOBAL VARIABLES==================================*/
const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const cheerio = require('cheerio');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const PORT = 8080;

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static("public"));
/*===========================body-parser======================================*/
// create application/x-www-form-urlencoded parser 
app.use(bodyParser.urlencoded({ extended: false }));
// parse various different custom JSON types as JSON 
app.use(bodyParser.json({ type: 'application/*+json' }));
// parse some custom thing into a Buffer 
app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }));
// parse an HTML body into a string 
app.use(bodyParser.text({ type: 'text/html' }));

/*=============================HANDLEBARS=======================================*/
//setup handlebars
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

/*===============================ROUTES======================================*/
app.get('/', function(req, res){
	res.render('index');
});

app.get('/saved', function(req, res){
	res.render('saved');
});

app.listen(PORT, function(){
	console.log('listening on http://localhost:' + PORT);
});