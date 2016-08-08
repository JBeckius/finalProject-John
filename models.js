var mongoose = require('mongoose');
var _ = require('underscore');

module.exports = function(wagner) {
  mongoose.createConnection('mongodb://localhost:27017/test');

  var Category =
    mongoose.model('Category', require('./category'), 'categories');

  var Post =
    mongoose.model('Post', require('./post'), 'posts');

  var models = {
    Category: Category,
    Post: Post
  };

  _.each(models, function(value, key) {
    wagner.factory(key, function() {
      return value;
    });
  });

  return models;
};
