//require mongoose
const mongoose = require('mongoose');
// Create Schema class
const Schema = mongoose.Schema;


//create schema for news
var NewsSchema = Schema({
      headline: {
            type: String,
            required: true
      },
      summary: {
            type: String,
            required: true
      },
      link: {
            type: String,
            required: true
      },
      img: String,
      saved: {
            type: Boolean,
            default: 0
      },
      notes: [{
            type: Schema.Types.ObjectId,
            ref: "Note"
      }]
});

// Create the News model with the newsSchema
const News = mongoose.model('News', NewsSchema);

// Export the News model
module.exports = News;