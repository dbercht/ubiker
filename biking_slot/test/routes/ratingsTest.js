/* global require: false, describe: false, before: false, it:false */
var assert = require("assert"),
    request = require('supertest'),
    Ratings = require('../../models/ratings.js'),
    testHelper = require('../helper.js'),
    server = require('../../server.js');

var app = server.app;

describe('Ratings', function() {
  describe('/slots/:slot_id/rating success', function() {
    var cookie;
    before(function(done) {
      testHelper.resetData(function() {
        testHelper.createTestSlot(0, function() {
            testHelper.createTestUser(0, function() {
              testHelper.getUserLoginCookie(
                app,
                0,
                function (c) { cookie = c; },
                done
                );
            });

        });
      });
    });
    it('should not allow users who are not logged in', function(done){
      request(app)
      .post('/slots/1/ratings')
      .send({
        value : 5
      })
      .expect(401, done);
    });
    it('should 400 for bad params', function(done){
      request(app)
      .post('/slots/1/ratings')
      .set('cookie', cookie)
      .send({
        val : 5
      })
      .expect(400, done);
    });
    it('should 200 for successful call', function(done){
      request(app)
      .post('/slots/1/ratings')
      .set('cookie', cookie)
      .send({
        rating : 5
      })
      .expect(200, done);
    });
  });
});
