/*global equire: false, describe: false, before: false, after: false, it:false */
var assert = require("assert"),
    request = require('supertest'),
    Requests = require('../../models/requests.js'),
    testHelper = require('../helper.js'),
    server = require('../../server.js');

var app = server.app;

describe('Slot Requests', function() {
  describe('/slots/:slot_id/request', function() {
    var cookie;
    before(function(done) {
      testHelper.getUserLoginCookie(
        app,
        0,
        function (c) { cookie = c; },
        done
        );
    });
    it('should 401 users who are not logged in', function(done){
      request(app)
      .post('/slots/1/requests')
      .expect(401, done);
    });
    it('should 200 for successful call', function(done){
      request(app)
      .post('/slots/1/requests')
      .set('cookie', cookie)
      .expect(200, done);
    });
  });
});
