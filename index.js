var express = require('express');
var wagner = require('wagner-core');

require('./models')(wagner);
var models = require('./models')(wagner)
var app = express();

app.use('/api/v1', require('./api')(wagner));

Category = models.Category;
Post = models.Post;

var POST_ID = '000000000000000000000001';
var post = {
  name: 'A post',
  _id: POST_ID,
  url: "http://#?",
  votes: 1,
  age: 0
};


app.listen(3000);
Post.create(post, function (err, doc) {
  if(err) {return console.log('error')}
})
console.log('Listening on 3000');
