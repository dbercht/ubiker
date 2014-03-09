/*global equire: false, describe: false, before: false, after: false, it:false */
var assert = require("assert"),
    Requests = require('../../models/requests.js'),
    testHelper = require('../helper.js');

describe('RequestSlot', function() {
  describe('#create()', function() {
    var req, res;
    before(function(done) {
      req = { 
        params : { slot_id : 1 },
        user : { id : 1 }
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
    it('should let a user create a new request', function(done){
      res.send = function() { 
        Requests.getRequest(1, 1, function(err, result) {
          if (err) assert.fail(false, false, "Request not created");
          else assert.equal(result.parking_slot_id, 1, "Request for wrong slot created");
          done();
        });
      };
      Requests.create(req, res);
    });
    it('should let a user update current request', function(done){
      req.params.slot_id = 2;
      res.send = function() { 
        Requests.getRequest(1, 2, function(err, result) {
          if (err) assert.fail(false, false, "Rating not created");
          else assert.equal(result.parking_slot_id, 2);
          done();
        });
      };
      Requests.create(req, res);
    });
    it('should NOT let a user have more than one requested (active) slot', function(done){
      req.params.slot_id = 2;
      res.send = function() { 
        Requests.getRequest(1, 1, function(err, result) {
          if (err) assert.equal(false, false, "Rating created ");
          else assert.equal(result.val, 2);
          done();
        });
      };
      Requests.create(req, res);
    });
  });
});
