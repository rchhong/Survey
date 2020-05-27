var express = require('express');
var router = express.Router();

var questionRouter = require('./questions');
router.use('/questions', questionRouter);

module.exports = router;