/* global require: false, describe: false, before: false, it:false */
var assert = require("assert"),
    Ratings = require('../../models/ratings.js'),
    testHelper = require('../helper.js');

describe('Ratings', function() {
  describe('#create()', function() {
    var req, res;
    before(function(done) {
      req = { 
        params : { slot_id : 1 },
        user : { id : 1 },
        body : { rating : 5 } 
      };
      res = {
        send : function() {}
      };
      testHelper.resetData(function() {
        testHelper.createTestSlot(0, function() {
          testHelper.createTestSlot(1, function() {
            testHelper.createTestUser(0, done);
          });
        });
      });
    });
    it('should let a user create a new rating', function(done){
      res.send = function() { 
        Ratings.getRating(1, 1, function(err, result) {
          if (err) assert.fail(false, false, "Rating not created");
          else assert.equal(result.val, 5);
          done();
        });
      };
      Ratings.create(req, res);
    });
    it('should let a user update a new rating', function(done){
      req.body.rating = 3;
      res.send = function() { 
        Ratings.getRating(1, 1, function(err, result) {
          if (err) assert.fail(false, false, "Rating not created");
          else assert.equal(result.val, 3);
          done();
        });
      };
      Ratings.create(req, res);
    });
    it('should let a user create ratings for others slots', function(done){
      req.body.rating = 2;
      req.params.slot_id = 2;
      res.send = function() { 
        Ratings.getRating(1, 2, function(err, result) {
          if (err) assert.fail(false, false, "Rating not created");
          else assert.equal(result.val, 2);
          done();
        });
      };
      Ratings.create(req, res);
    });
  });
});
