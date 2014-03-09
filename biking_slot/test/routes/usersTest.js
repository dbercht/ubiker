/* global require: false, describe: false, before: false, after: false */
var assert = require("assert"),
    request = require('supertest'),
    testHelper = require('../helper.js'),
    User = require('../../models/users.js'),
    app = require('../../server.js');

var app = app.server;

describe('User Query', function() {
  before(function(done) {
    testHelper.resetData(function() {
      testHelper.createTestUser(0, done);
    });
  });
  describe('#findById()', function() {
    it('should find y id', function(done) {
      var user = User.findById(1, function(err, user) {
        if (user) {
          assert.equal(user.id, 1, "Id " + user.id + " not equal to 1");
        }  else {
          assert.fail(null, 1, "User not found");
        }
        done();
      }); 
    });
  });
  describe('#findByEmail()', function() {
    it('should find by email', function(done) {
      var user = User.findByEmail(testHelper.users[0].email, function(err, user) {
        if (user) {
          assert.equal(user.email, testHelper.users[0].email, "Email " + user.email + " not equal to " + testHelper.users[0].email);
        }  else {
          assert.fail(null, testHelper.users[0].email, "User not found");
        }
        done();
      }); 
    });
  });
});
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
