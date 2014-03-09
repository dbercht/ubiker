var converter = require("../../utils/converter.js");
var assert = require("assert");

describe('Converter', function(){
  describe('#degreesToMiles()', function(){
    it('should calculate a half degree to a half unit', function(){
      assert.equal(converter.degreesToMiles(0.5), 34.345);
    });
    it('should calculate a full unit to 1 degree', function(){
      assert.equal(converter.degreesToMiles(1), 68.69);
    });
  });
  describe('#milesToDegrees()', function(){
    it('should calculate a half unit to a half degree', function(){
      assert.equal(converter.milesToDegrees(34.345), 0.5);
    });
    it('should calculate a full unit to 1 degree', function(){
      assert.equal(converter.milesToDegrees(68.69), 1);
    });
  });
});
