/*=====================NOTES MODEL=========================*/
//require mongoose
const mongoose = require('mongoose');
// Create Schema class
const Schema = mongoose.Schema;

// Create a Schema for notes
var NotesSchema = new Schema({
      // Content of the users note
      body: {
            type: String
      }
});

// Reminder: Mongoose automatically saves the ObjectIDs of the notes

// Create the Note model with the NoteSchema
var Note = mongoose.model("Note", NotesSchema);

// Export the Note model
module.exports = Note;