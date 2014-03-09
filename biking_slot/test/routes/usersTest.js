/* global require: false, describe: false, before: false, after: false */
var assert = require("assert"),
    request = require('supertest'),
    testHelper = require('../helper.js'),
    server = require('../../server.js');

var app = server.app;

describe("User routes", function() {
  before(function(done) {
    testHelper.resetData(function() {
      done();
    });
  });
  describe('#create()', function(){
    it('should refuse creation with missing params', function(done){
      request(app)
      .post('/users')
      .expect(400, done);
    });
    it('should create with unique params', function(done){
      request(app)
      .post('/users')
      .send({
        username : 'test',
        password : 'password',
        email : 'user@email.com'
      })
      .expect(201, done);
    });
    it('should not allow duplicate emails', function(done){
      request(app)
      .post('/users')
      .send({
        username : 'bla',
        password : 'password',
        email : 'user@email.com'
      })
      .expect(500, done);
    });
  });
});
