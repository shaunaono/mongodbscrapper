// Dependencies
var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

//Scrapping dependencies
var request = require('request');
//similar to jquery ajax method
var axios = require('axios');
var cheerio = require('cheerio');

// Article and Note 
var Article = require('./models/Article');
var Note = require('./models/Note');

//Express

var app = express();
var PORT = 3000;

// Morgan and Body-Parser

app.use(logger("dev"));
app.use(bodyParser.urlencoded({
    extended: true
}));

//express.static to use public folder as static dir
app.use(express.static("public"));

//Connect Mongo DB
mongoose.connect("mongodb://https://git.heroku.com/mongodbwebscraper.git");



//Routes
//GET request for scraping website
app.get("/scrape", function (req, res) {
    axios.get("https://www.fitnessrxwomen.com", (function (response) {
        //cheerio load
        var $ = cheerio.load(response.data);
        $("article h2").each(function (i, element) {
            var result = {};
            result.title = $(this)
                .children("a")
                .text();
            result.link = $(this)
                .children("a")
                .attr("href");
            //Create new Article using 'result' object from scrapping
            db.Article.create(result).then(function (dbArticle) {
                console.log(dbArticle);
            })
                .catch(function (err) {
                    return res.json(err);
                });
        });
        res.send("Your scrape is complete!");
    }));
});

//GET route for getting all Articles from db
app.get("/articles", function (req, res) {
    db.Article.find({}).then(function (dbArticle) {
        res.json(dbArticle);
    })
        .catch(function (err) {
            res.json(err);
        });
});

// GET route for getting specific Article from db with id & populate with Note
app.get("./articles/:id", function (req, res) {
    db.Article.findOne({ _id: req.params.id })
        .populate("note")
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

//Saving or updating existing Note associated with Article
app.post("./articles/:id", function (req, res) {
    db.Note.create(req.body).then(function (dbNote) {
        return dbArticle.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

//Start Server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});





