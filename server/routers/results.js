const express = require('express');
const router = express.Router();

const Results = require('../schema/Result');

router.post("/add", (req, res) => {
    console.log(req.body);
    Results.create({results : req.body.results}, (err, result) => {
        if(err) console.log(err);
        else {
            console.log(result);
            res.json({"message" : "successfully pushed results"});
        }
    })
});

module.exports = router;