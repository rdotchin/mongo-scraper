/*===========================DEPENDENCIES==================================*/
const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const logger = require("morgan");
const mongoose = require("mongoose");
// Requiring the Note and News models
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 8080;

// Morgan and body-parser
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
      extended: false
}));

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static("app/public"));

/*=============================HANDLEBARS=======================================*/
//setup handlebars
app.engine('handlebars', exphbs({
      defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//require html routes
require('./routing/html-routes.js')(app);


app.listen(PORT, function() {
      console.log('listening on http://localhost:' + PORT);
});