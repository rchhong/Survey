const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ResultSchema = new Schema({
    results : [{question : String, result : String}]
});

const Result = mongoose.model("Result", ResultSchema);

module.exports = Result;