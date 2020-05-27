var express = require('express');
var router = express.Router();

var questionRouter = require('./questions');
router.use('/questions', questionRouter);

var resultsRouter = require('./results');
router.use('/results', resultsRouter);

module.exports = router;