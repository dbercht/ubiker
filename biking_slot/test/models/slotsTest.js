/*global equire: false, describe: false, before: false, after: false, it:false */
var assert = require("assert"),
    Slots = require('../../models/slots.js'),
    testHelper = require('../helper.js');

describe('Slots', function() {
  describe('#()', function() {
    var req, res;
    before(function(done) {
      req = {
        params: {
                  latitude : 0.01,
                  longitude : 0.01
                },
      query : {radius: 100}
      };
      res = {
        send : function() {}
      };
      testHelper.resetData(function() {
        testHelper.createTestSlot(0, function() {
          testHelper.createTestSlot(1, function() {
            testHelper.createTestSlot(2, function() {
              testHelper.createTestUser(0, done);
            });
          });
        });
      });
    });
    it('should return closest slot first', function(done) {
      res.send = function(slots) {
        assert.equal(slots[0].id, 1);
        assert.equal(slots[1].id, 2);
        assert.equal(slots[2].id, 3);
        done();
      }
      Slots.all(req, res);
    });
    it('should return filtered slots', function(done) {
      req.query.status = 'COMPLETE';
      res.send = function(slots) {
        assert.equal(slots[0].id, 2);
        done();
      }
      Slots.all(req, res);
    });
  });
});
