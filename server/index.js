const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const mongoose = require('mongoose');

require('dotenv').config()

mongoose.connect('mongodb://localhost:27017/survey', {useNewUrlParser: true , useUnifiedTopology: true})
    .then(() => {
        console.log("MongoDB port connection active");
    }).catch((err) => {
        console.log(err);
    });
mongoose.set('useCreateIndex', true);
const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error: "));
db.once('open', () => {
  console.log("MongoDB database connection established successfully");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// DO NOT LET THESE TWO LINES OF CODE END UP IN FINAL PRODUCT
// FOR TESTING PURPOSES ONLY
const cors = require('cors');
app.use(cors());

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`listening on port ${ port }`);
});

var apiRouter = require('./routers/api');
app.use('/api/', apiRouter);
