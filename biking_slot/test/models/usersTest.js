/* global require: false, describe: false, before: false, after: false */
var assert = require("assert"),
    testHelper = require('../helper.js'),
    User = require('../../models/users.js');

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
