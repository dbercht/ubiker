/* global require: false, it: false, describe: false */
var Slot = require("../../models/slots.js");
var assert = require("assert");

describe('Slot', function(){
  var req = {'params' : {}, 'query' : {}};
  beforeEach(function(done) {
    req.query = {
      'radius' : 5,
      'limit' : 5
    };
    req.params = {
      'latitude' : 5.4,
      'longitude' : 5.4
    };
    done();
  });
  describe('#buildAllQuery()', function(){
    it('should not contain placement or status with no params', function(){
      assert.equal(Slot.buildAllQuery(req).query.indexOf('AND s.name IN'), -1);
      assert.equal(Slot.buildAllQuery(req).query.indexOf('AND p.name IN'), -1);
    });
    it('should contain a WHERE clause for status', function(){
      req.query.status = "YES";
      assert.notEqual(Slot.buildAllQuery(req).query.indexOf('AND s.name IN ($5)'), -1);
      assert.equal(Slot.buildAllQuery(req).query.indexOf('AND p.name IN'), -1);
    });
    it('should contain a WHERE clause for placement', function(){
      req.query.placement = "YES";
      assert.equal(Slot.buildAllQuery(req).query.indexOf('AND s.name IN ($5)'), -1);
      assert.notEqual(Slot.buildAllQuery(req).query.indexOf('AND p.name IN'), -1);
    });
    it('should contain a WHERE clause for placement AND status', function(){
      req.query.status = "YES";
      req.query.placement = "YES";
      assert.notEqual(Slot.buildAllQuery(req).query.indexOf('AND s.name IN ($5)'), -1, "Should contain the where clause with appropriate placeholder");
      assert.notEqual(Slot.buildAllQuery(req).query.indexOf('AND p.name IN ($6)'), -1, "Should contain the where clause with appropriate placeholder");
    });
  });
});
