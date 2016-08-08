var mongoose = require('mongoose');
var Category = require('./category');

var postSchema = {
  name: { type: String, required: true },
                              //requires start w/ http://
                              //might need https://
  url: { type: String, match: /^http:\/\//i, required: true },
  votes: { type: Number, required: true },
  age: { type: Number, required: true },
  category: Category.categorySchema
};

var schema = new mongoose.Schema(postSchema);

schema.set('toObject', { virtuals: true });
schema.set('toJSON', { virtuals: true });

module.exports = schema;
module.exports.postSchema = postSchema;
