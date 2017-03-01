const cheerio = require('cheerio');
const mongoose = require("mongoose");
const request = require('request');
const Note = require("./../models/noteModel.js");
const News = require("./../models/newsmodel.js");
const scraper = require('./../controllers/controller.js')
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
module.exports= function(app) {
    app.get('/', function (req, res) {
        News.find({}, function (error, doc) {
            if (error) {
                console.log(error);
            }
            else {
                //set up data to show in handlebars
                const hbsObject = {news: doc};
                res.render('index', hbsObject);
            }
        });
    });

    app.get('/scrape', function (req, res) {
        //make a request to the NYT site to grab articles
        request('https://www.nytimes.com/section/world/americas', function (err, response, html) {
            scraper.scrape(function(){
                res.redirect('/');
            });

        });
    });
    // Bring user to the saved html page showing all their saved articles
    app.get('/saved', function (req, res) {
        News.find({}, function (error, doc) {
            if (error) {
                console.log(error);
            }
            else {
                //set up data to show in handlebars
                const hbsObject = {news: doc};
                res.render('saved', hbsObject);
            }
        });
    });

    // Set the new article saved to true
    app.get('/save/:id?', function (req, res) {
        // Set the _id of the article the user would like to save to a variable
        var id = req.params.id;
        // Find the news article by id
        News.findById(id, function (err, news) {
            if (err) return handleError(err);

            news.saved = 1;
            news.save(function (err, updatedNews) {
                if (err) return handleError(err);
                res.redirect('/');
            })

        })
    });

    // Delete News article from teh saved articles page
    app.get('/delete/:id?', function (req, res) {
        // set the _id of the article the user would like to delete from saved to a variable
        var id = req.params.id;

        // Find the news article by id
        News.findById(id, function (err, news) {
            //set saved to 0(false)
            news.saved = 0;
            // Save the updated save
            news.save(function (err, updatedNews) {
                if (err) return handleError(err);
                res.redirect('/saved');
            })
        })
    });

    app.get('/notes/:id', function (req, res) {
        //Query to find the matching id to the passed in it
        News.findOne({_id: req.params.id})
        //Populate all of the notes associated with it
            .populate("notes")
            //execute the query
            .exec(function (error, doc) {
                // Log any errors
                if (error) {
                    console.log(error);
                }
                // Otherwise, send the doc to the browser as a json object
                else {
                    console.log(doc);
                    res.json(doc);
                }
            });
    });

    app.post('/notes/:id', function (req, res) {
        var newNote = new Note(req.body);

        //save newNote to teh db
        newNote.save(function (err, doc) {
            // Log any errors
            if (error) {
                console.log(error);
            }
            else {
                News.findOneAndUpdate({"_id": req.params.id}, {"note": doc._id})
                // Execute the above query
                    .exec(function (err, doc) {
                        // Log any errors
                        if (err) {
                            console.log(err);
                        }
                        else {
                            // Or send the document to the browser
                            res.send(doc);
                        }
                    })

            }
        })
    });

}