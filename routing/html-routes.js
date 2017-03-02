const mongoose = require("mongoose");
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
        //find all the news articles in the mongoDB
        News.find({}, function (error, doc) {
            if (error) {
                console.log(error);
            }
            else {
                //set up data to show in handlebars
                const hbsObject = {news: doc};
                //render the index.handlebars file with dbsObject
                res.render('index', hbsObject);
            }
        });
    });

    app.get('/scrape', function (req, res) {
            //call the scrape function from controller.js to initiate the scrape
            scraper.scrape(function(){
                /*cb from scrape function and redirect back to the homepage to display
                the scraped data*/
                res.redirect('/');
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
    // Delete News article from teh saved articles page
    app.get('/delete/:id?', function (req, res) {
        // set the _id of the article the user would like to delete from saved to a variable
        var id = req.params.id;
        // Find the news article by id
        News.findById(id, function (err, news) {
            //set saved to 0(false) so it will be removed from the saved page
            news.saved = 0;
            // save the updated changes to the article
            news.save(function (err, updatedNews) {
                if (err) return handleError(err);
                //redirect back to the saved page
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
        console.log(req.body);
        //save newNote to teh db
        newNote.save(function (err, doc) {
            // Log any errors
            console.log('DOC ID');
            console.log(doc.id);
            /*if (error) console.log(error);*/
            News.findOneAndUpdate(
                {_id: req.params.id},
                {$push: {notes: doc.id}},
                {new: true},
                function(err, newdoc){
                if(err) console.log(err);
                console.log(newdoc);
                res.send(newdoc);
            });
        });
    });


};