var assert = require('assert');
var express = require('express');
var superagent = require('superagent');
var wagner = require('wagner-core');

var URL_ROOT = 'http://localhost:3000';

describe('Category API', function() {
  var server;
  var Category;
  var Post;

  before(function() {
    var app = express();

    // Bootstrap server
    models = require('./models')(wagner);
    app.use(require('./api')(wagner));

    server = app.listen(3000);

    // Make models available in tests
    Category = models.Category;
    Post = models.Post;
  });

  after(function() {
    // Shut the server down when we're done
    server.close();
  });

  beforeEach(function(done) {
    // Make sure categories are empty before each test
    Category.remove({}, function(error) {
      assert.ifError(error);
      Post.remove({}, function(error) {
        assert.ifError(error);
        done();
      });
    });
  });

  it('can load a post by id', function(done) {
    // Create a single post
    //defining post id
    var POST_ID = '000000000000000000000001';
    //defining post
    var post = {
      name: 'A post',
      _id: POST_ID,
      url: "http://#?",
      votes: 1,
      age: 0
    };
    //Post refers to post model and creates model
                //post is our object with info
                                      //doc === post
    Post.create(post, function(error, doc) {
      //checks for error
      assert.ifError(error);
      var url = URL_ROOT + '/post/id/' + POST_ID;
      // Make an HTTP request to
      // "localhost:3000/post/id/000000000000000000000001"
      //using superagent
      superagent.get(url, function(error, res) {
        assert.ifError(error);
        var result;
        // And make sure we got the LG G4 back
        assert.doesNotThrow(function() {
          result = JSON.parse(res.text);
        });
        assert.ok(result.post);
        assert.equal(result.post._id, POST_ID);
        assert.equal(result.post.name, 'A post');
        done();
      });
    });
  });

  //this guy is more complex, because it needs to create a bunch of data to test
  it('can load all posts in a category with sub-categories', function(done) {
    //set up categories
    var categories = [
      { _id: 'Electronics' },
      { _id: 'Phones', parent: 'Electronics' },
      { _id: 'Laptops', parent: 'Electronics' },
      { _id: 'Bacon' }
    ];

    //set up posts to go in categories
    var posts = [
      {
        name: 'CSS Animations',
        url: 'http://#?',
        category: { _id: 'Phones', ancestors: ['Electronics', 'Phones'] },
        votes: 1,
        age: 0
      },
      {
        name: 'Asus Zenbook Prime',
        url: 'http://#?',
        category: { _id: 'Laptops', ancestors: ['Electronics', 'Laptops'] },
        votes: 1,
        age: 2
      },
      {
        name: 'Flying Pigs Farm Pasture Raised Pork Bacon',
        url: 'http://#?',
        category: { _id: 'Bacon', ancestors: ['Bacon'] },
        votes: 1,
        age: 0
      }
    ];

    // Create the 4 categories using Mongoose model
    Category.create(categories, function(error, categories) {
      assert.ifError(error);
      // And our 3 posts using Mongoose model
      Post.create(posts, function(error, posts) {
        assert.ifError(error);
        var url = URL_ROOT + '/post/category/Electronics';
        // Make an HTTP request to localhost:3000/post/ancestor/Electronics
        //using superagent
        superagent.get(url, function(error, res) {
          assert.ifError(error);
          var result;
          assert.doesNotThrow(function() {
            result = JSON.parse(res.text);
          });
          assert.equal(result.posts.length, 2);
          // Should be in ascending order by name
          assert.equal(result.posts[0].name, 'Asus Zenbook Prime');
          assert.equal(result.posts[1].name, 'CSS Animations');

          // Sort by price, ascending
          //remember the query param stuff.
          //?anything after the url specifies a query parameter.
          //in this case, whether or not we want to sort by price
          var url = URL_ROOT + '/post/category/Electronics?age=1';
          superagent.get(url, function(error, res) {
            assert.ifError(error);
            var result;
            assert.doesNotThrow(function() {
              result = JSON.parse(res.text);
            });
            assert.equal(result.posts.length, 2);
            // Should be in ascending order by price
            assert.equal(result.posts[0].name, 'CSS Animations');
            assert.equal(result.posts[1].name, 'Asus Zenbook Prime');
            done();
          });
        });
      });
    });
  });
});
