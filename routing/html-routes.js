const mongoose = require("mongoose");
const Note = require("./../models/noteModel.js"); //require the Note model
const News = require("./../models/newsmodel.js"); //require the News model
const scraper = require('./../controllers/controller.js'); //require the scrape function

// Require bluebird as promise because mongoose promises are deprecated
var Promise = require('bluebird');
mongoose.Promise = Promise;

// Database configuration with mongoose
mongoose.connect('mongodb://localhost/nytdb' || );
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
//export, will be used in server.js
module.exports= function(app) {
    /*HOME PAGE*/
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

    /*when the scrape button is pressed it will run teh scrape function from controllers/controller.js*/
    app.get('/scrape', function (req, res) {
            //call the scrape function from controller.js to initiate the scrape
            scraper.scrape(function(){
                /*callback from scrape function and redirect back to the homepage to display
                the scraped articles*/
                res.redirect('/');
            });
    });

    // Save the article by updating the articles saved to 1(true);
    app.get('/save/:id?', function (req, res) {
        // Set the _id retrieved from the req.params.id of the article the user would like to save to a variable
        var id = req.params.id;
        // Find the news article by id
        News.findById(id, function (err, news) {
            if (err) return handleError(err);
            //set saved to 1(true)
            news.saved = 1;
            //save the update in mongoDB
            news.save(function (err, updatedNews) {
                if (err) return handleError(err);
                //no redirect since it is only updating data and not affecting the view
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
        var id = req.params.id; // set the _id of the article the user would like to delete from saved to a variable
        // Find the news article by id
        News.findById(id, function (err, news) {
            news.saved = 0; //set saved to 0(false) so it will be removed from the saved page

            // save the updated changes to the article
            news.save(function (err, updatedNews) {
                if (err) return handleError(err); //if err
                res.redirect('/saved'); //redirect back to the saved page as the updated data will effect the view
            })
        })
    });

    //retrieve the notes attached to saved articles to be displayed in the notes modal
    app.get('/notes/:id', function (req, res) {
        //Query to find the matching id to the passed in it
        News.findOne({_id: req.params.id})
            .populate("notes") //Populate all of the notes associated with it
            .exec(function (error, doc) { //execute the query
                if (error) console.log(error);
                // Otherwise, send the doc to the browser as a json object
                else {
                    console.log(doc);
                    res.json(doc);
                }
            });
    });

    app.post('/notes/:id', function (req, res) {
        //create a new note with req.body
        var newNote = new Note(req.body);
        //save newNote to the db
        newNote.save(function (err, doc) {
            // Log any errors
            console.log('DOC ID');
            console.log(doc.id);
            /*if (error) console.log(error);*/
            //find and update the note
            News.findOneAndUpdate(
                {_id: req.params.id}, // find the _id by req.params.id
                {$push: {notes: doc.id}}, //push to the notes array
                {new: true},
                function(err, newdoc){
                if(err) console.log(err);
                console.log(newdoc);
                res.send(newdoc);
            });
        });
    });


}; //end of module.exports