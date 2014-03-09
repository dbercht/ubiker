/* global require: false, describe: false, before: false, it:false */
var assert = require("assert"),
    request = require('supertest'),
    testHelper = require('../helper.js'),
    Auth = require('../../models/auth.js'),
    passport = require('passport'),
    server = require('../../server.js');

var app = server.app;

describe("Auth routes", function() {
  before(function(done) {
    testHelper.resetData(function() {
      testHelper.createTestUser(0, done);
    });
  });
  describe("unauth acess to /login", function() {
    it('should fail GET with no prior login', function(done){
      request(app)
      .get('/login')
      .expect(401, done);
    });
    it('should fail a login without password', function(done){
      request(app)
      .post('/login')
      .send({
        email : testHelper.users[0].email
      })
    .expect(400, done);
    });
    it('should fail a login without email', function(done){
      request(app)
      .post('/login')
      .send({
        password : testHelper.users[0].password
      })
    .expect(400, done);
    });
    it('should 401 a login with incorrect information', function(done){
      request(app)
      .post('/login')
      .send({
        email : testHelper.users[0].email,
        password : 'wrong'
      })
    .expect(401, done);
    });
    it('should 500 a login with inexisting email', function(done){
      request(app)
      .post('/login')
      .send({
        email : "non-existing",
        password : 'wrong'
      })
    .expect(500, done);
    });
    it('should log a user in with POST', function(done){
      request(app)
      .post('/login')
      .send({
        email : testHelper.users[0].email,
        password : testHelper.users[0].password,
      })
    .expect(200, done);
    });
  });
  describe('GET/POST /login success', function() {
    var cookie;
    before(function(done) {
      testHelper.getUserLoginCookie(
        app,
        0,
        function (c) { cookie = c },
        done
        );
    });
    it('should retrieve user info once logged in', function(done){
      request(app)
      .get('/login')
      .set('cookie', cookie)
      .expect(200, done);
    });
  });
});
