/* global require: false, describe: false, before: false, it:false */
var assert = require("assert"),
    testHelper = require('../helper.js'),
    Auth = require('../../models/auth.js'),
    passport = require('passport');

describe('Auth Query', function() {
  before(function(done) {
    testHelper.resetData(function() {
      testHelper.createTestUser(0, done);
    });
  });
  describe('#serializeUser()', function() {
    it('serializeUser to id', function(done) {
      var user = { id : 10 };
      passport.serializeUser(user, function(err, id) {
        assert.equal(id, 10);
        done();
      });
    });
  });
  describe('#deserializeUser()', function() {
    it('should deserialize user from id', function(done) {
      passport.deserializeUser(1, function(err, user) {
        assert.equal(user.username, testHelper.users[0].username);
        done();
      });
    });
    it('should deserialize user without password', function(done) {
      passport.deserializeUser(1, function(err, user) {
        assert.equal('password' in user, false);
        done();
      });
    });
  });
  describe('#ensureAuthenticated()', function(){
    it('should send appropriate code if user is not authenticated', function(done){
      var req = { isAuthenticated : function() { return false; } };

      var res = { send : function(code) { assert.equal(code, 401); done(); }};
      var next = function(code) { assert.equal(code, 401); done(); };

      Auth.ensureAuthenticated(req, res, next);
    });
    it('should proceed if user is authenticated', function(done){
      var req = { isAuthenticated : function() { return true; } };
      var res = {};
      var next = function() { assert.equal(true, true); done(); };

      Auth.ensureAuthenticated(req, res, next);
    });
  });
});
