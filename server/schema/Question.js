var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var questionSchema = new Schema({
    title: String,
});

var Question = mongoose.model("Question", questionSchema);

module.exports = Question;