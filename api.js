var express = require('express');
var status = require('http-status');

module.exports = function(wagner) {
  var api = express.Router();

  api.get('/post/id/:id', wagner.invoke(function(Post) {
    return function(req, res) {
      Post.findOne({ _id: req.params.id},
        handleOne.bind(null, 'post', res));
    };
  }));
  api.get('/post/category/:id', wagner.invoke(function(Post) {
    return function(req, res) {
      //sorts by votes
      var sort = { votes: 1 };

      Post
        .find({ 'category.ancestors': req.params.ig })
        .sort(sort)
        .exec(handleMany.bind(null, 'posts', res));
    }
  }))

  return api;
}

function handleOne(property, res, error, result) {
  if (error) {
    return res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ error: error.toString() });
  }
  if (!result) {
    return res
      .status(status.NOT_FOUND)
      .json({ error: 'Not found' });
  }

  var json = {};
  json[property] = result;
  res.json(json);
}

function handleMany(property, res, error, result) {
  if (error) {
    return res
    .status(status.INTERNAL_SERVER_ERROR)
    .json({ error: error.toString() });
  }

  var json = {};
  json[property] = result;
  res.json(json);
}
