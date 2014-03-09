/* global require: false, it: false, describe: false */
var Request = require("../../models/requests.js");
var assert = require("assert");

describe('Request', function(){
  describe('#slotValidInterval()', function(){
    it('should default build a default clause', function(){
      var expectedQuery = "coalesce( date_requested, NOW()) + interval '" + Request.CURRENT_INTERVAL_HOURS + " hours' > NOW()";
      assert.equal(Request.slotValidInterval(), expectedQuery);
    });
    it('should build a properly aliased clause', function(){
      var expectedQuery = "coalesce( alias.date_requested, NOW()) + interval '" + Request.CURRENT_INTERVAL_HOURS + " hours' > NOW()";
      assert.equal(Request.slotValidInterval('alias'), expectedQuery);
    });
    it('should take current config to reflext interval hours', function(){
      Request.CURRENT_INTERVAL_HOURS = 2;
      var expectedQuery = "coalesce( date_requested, NOW()) + interval '" + Request.CURRENT_INTERVAL_HOURS + " hours' > NOW()";
      
      assert.equal(Request.slotValidInterval(), expectedQuery);
    });
  });
});

