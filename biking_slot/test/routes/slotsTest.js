
/* global require: false, describe: false, before: false, it:false */
var assert = require("assert"),
    request = require('supertest'),
    server = require('../../server.js');

var app = server.app;

describe("Slots route", function() {
  describe("/slots/:lat;:lng", function() {
    it('should succeed for good params', function(done){
      request(app)
      .get('/slots/0.0;0.1')
      .expect(200, done);
    });
    it('should succeed for good raius request', function(done){
      request(app)
      .get('/slots/0.0;-0.1?radius=3&limit=4&status=COMPLETE,IN_PROGRESS&placement=SIDEWALK')
      .expect(200, done);
    });
    it('should fail for bad url params', function(done){
      request(app)
      .get('/slots/00;0.1?limit=3')
      .expect(400, done);
    });
    it('should fail for bad query params', function(done){
      request(app)
      .get('/slots/00;0.1?limit=3.4')
      .expect(400, done);
    });
    it('should fail for bad query params (radius)', function(done){
      request(app)
      .get('/slots/00;0.1?radius=3.4')
      .expect(400, done);
    });
    it('should fail for bad query params (status)', function(done){
      request(app)
      .get('/slots/00;0.1?status=CO#$@$')
      .expect(400, done);
    });
  });
});
