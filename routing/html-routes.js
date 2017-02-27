const cheerio = require('cheerio');
const mongoose = require("mongoose");
const request = require('request');
const Note = require("./../models/noteModel.js");
const News = require("./../models/newsmodel.js");
// Database configuration with mongoose
mongoose.connect('mongodb://localhost/nytdb');
const db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error){
    console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
    console.log("Mongoose connection successful.");
});

/*===============================ROUTES======================================*/
module.exports= function(app){
	app.get('/', function(req, res){
	    News.find({}, function(error, doc) {
	        if(error){console.log(error);}
	        else{
	            //set up data to show in handlebars
                const hbsObject = {news: doc};
                res.render('index', hbsObject);
            }
        });
	});

	// Bring user to the saved html page showing all their saved articles
	app.get('/saved', function(req, res){
        News.find({}, function(error, doc) {
            if(error){console.log(error);}
            else{
                //set up data to show in handlebars
                const hbsObject = {news: doc};
                res.render('saved', hbsObject);
            }
        });
	});

	// Set the new article saved to true
	app.get('/save/:id?', function(req, res){
	    // Set the _id of the article the user would like to save to a variable
	    var id = req.params.id;
	    // Find the news article by id
        News.findById(id, function(err, news){
            if (err) return handleError(err);

            news.saved = 1;
            news.save(function(err, updatedNews){
                if (err) return handleError(err);
                res.redirect('/');
            })

        })
    });

	// Delete News article from teh saved articles page
	app.get('/delete/:id?', function(req, res){
	    // set the _id of the article the user would like to delete from saved to a variable
	    var id = req.params.id;

        // Find the news article by id
        News.findById(id, function(err, news){
            //set saved to 0(false)
            news.saved = 0;
            // Save the updated save
            news.save(function(err, updatedNews){
                if (err) return handleError(err);
                res.redirect('/saved');
            })
        })
    })
	app.get('/scrape', function(req, res){
        //make a request to the NYT site to grab articles
        request('https://www.nytimes.com/section/world/americas', function(err, response, html){
            //Load the html body from request into cheerio
            const $ = cheerio.load(html);

            //For each element with a "story" class
            $('.story-body').each(function(i, element){
                // Save the text of the title
                const headline = $(this).find("h2").text();
                // Save the link for the story
                const link = $(this).children("a").attr("href");
                // Save the text summary for the story
                const summary = $(this).find("p").text();

                console.log(headline);
                console.log(link);
                console.log(summary);

                //create an object of every headline, link and summary
                const result = {};

                result.headline = headline;
                result.link = link;
                result.summary = summary;
                //create a new entry that passes the result object to the entry
                const entry = new News(result);

                // Save entry to the db
                entry.save(function(err, doc){
                    // Console.log any errors
                    if(err){console.log(err);}
                    // Or log the doc
                    else{console.log(doc);}

                })

            })

        });

		res.redirect('/');
	});

};