var express = require('express');
var router = express.Router();

const Questions = require('../schema/Question');

router.post('/add', (req, res) => {
    console.log(req.body);
    Questions.create({title: req.body.title}, (err, question) => {
        if(err) console.log(err);
        else {
            res.json({"message" : "successfully added question"});
        }
    });
});

router.get('/', (req, res) => {
    Questions.find({}, (err, questions) => {
        if(err)
        {
            console.log(err);
        }
        if(questions === null) {
            res.json({"questions": []});
        }
        else {
            res.json({"questions": questions});
        }
    })
});

module.exports = router;