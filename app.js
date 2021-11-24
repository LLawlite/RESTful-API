
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');


const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//TODO

mongoose.connect('mongodb://localhost:27017/wikiDB');
const articleSchema = new mongoose.Schema({
    title:String,
    content:String
  });

const Article = mongoose.model('Article', articleSchema);  

/////////////////////////////Request Targeting all articles///////////////////////////////////////////

app.route("/articles").
  get(function(req,res){
    Article.find({},function(err,foundArticle){
      if(!err){
      res.send(foundArticle);
      }
      else
      {
        res.send(err);
      }
    });
  }).
  post(function(req,res){
    const newArticle=new Article({
      title:req.body.title,
      content:req.body.content
    });
    newArticle.save(function(err){
      if(!err){
        res.send("Successfully added");
      }else{
        res.send(err);
      }
    });
  })
  .delete(function(req,res){
    Article.deleteMany({},function(err){
      if(!err){
        res.send("Successfully deleted");
      }else
      {
        res.send(err);
      }
    })
  });


  /////////////////////////////Request Targeting a specific articles///////////////////////////////////////////

  app.route("/articles/:articlesTitle")
    .get(function (req,res) {
      Article.findOne({title:req.params.articlesTitle},function (err,foundArticle) {
        if (foundArticle) {
          res.send(foundArticle);
        }
        else
        {
          res.send("No match found");
        }
      })
    })
    .put(function (req,res){
      Article.updateOne(
        {title:req.params.articlesTitle},
        {title:req.body.title,content:req.body.content},
        
        function (err) {
          if (!err) {
            res.send("Successfully updated");
          }else{
            res.send(err);
          }
        }
        );
      
    })
    .patch(function (req,res) { //It is used to make particular changes 
      Article.updateOne(
        {title:req.params.articlesTitle},
        {$set:req.body}, //it will only update the value with the user provided
        function (err) {
          if(!err){
            res.send("Successfully updated")
          }else{
            res.send(err)
          }
        }
      );
    })
    .delete(function(req,res){
      Article.deleteMany({title:req.params.articlesTitle},function(err){
        if(!err){
          res.send("Successfully deleted");
        }else
        {
          res.send(err);
        }
      })
    });


app.listen(3000, function() {
  console.log("Server started on port 3000");
});