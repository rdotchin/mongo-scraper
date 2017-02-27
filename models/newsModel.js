/*===============NEWS MODEL=========================*/
//require mongoose
const mongoose = require('mongoose');
// Create Schema class
const Schema = mongoose.Schema;

// Connect to mongoose using localhost db
mongoose.connect('mongodb://localhost/nytdb');

//create schema for news
var NewsSchema = Schema({
	headline: {type: String, required: true},
	summary: {type: String, required: true},
	link: {type: String, required: true},
	img: String,
	notes: {
	    type: Schema.Types.ObjectId,
        ref: "Note"
    }
});

// Create the News model with the newsSchema
module.exports = mongoose.model('News', NewsSchema);

// Export the News model
module.exports = News;




