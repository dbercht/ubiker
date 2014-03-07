var sanitizer = require("../utils/sanitizer.js");
var expect = require("chai").expect;
var assert = require("assert");

describe('Sanitizer', function(){
  describe('#isSanitized()', function(){
    it('should return true when expected float is a float', function(){
      expect(sanitizer.isSanitized("123.432", sanitizer.FLOAT)).to.be.true;
      expect(sanitizer.isSanitized("-123.432", sanitizer.FLOAT)).to.be.true;
    });
    it('should return false when expected float is not a float', function(){
      expect(sanitizer.isSanitized("123afds.432", sanitizer.FLOAT)).to.be.false;
      expect(sanitizer.isSanitized("123 .432", sanitizer.FLOAT)).to.be.false;
      expect(sanitizer.isSanitized("", sanitizer.FLOAT)).to.be.false;
    });
    it('should return true when expected int is an int', function(){
      expect(sanitizer.isSanitized("123", sanitizer.INT)).to.be.true;
    });
    it('should return false when expected int is not an int', function(){
      expect(sanitizer.isSanitized("3 3", sanitizer.INT)).to.be.false;
      expect(sanitizer.isSanitized("abc", sanitizer.INT)).to.be.false;
      expect(sanitizer.isSanitized("-3", sanitizer.INT)).to.be.false;
      expect(sanitizer.isSanitized("", sanitizer.INT)).to.be.false;
    });
    it('should return true when expected string is a string', function(){
      expect(sanitizer.isSanitized("ABC", sanitizer.STRING)).to.be.true;
      expect(sanitizer.isSanitized("abc", sanitizer.STRING)).to.be.true;
    });
    it('should return true when expected string is not a string', function(){
      expect(sanitizer.isSanitized("12", sanitizer.STRING)).to.be.false;
      expect(sanitizer.isSanitized("AD0fd", sanitizer.STRING)).to.be.false;
      expect(sanitizer.isSanitized("fd-sdf", sanitizer.STRING)).to.be.false;
    });
    it('should return true when expected string array is a array', function(){
      expect(sanitizer.isSanitized("abc", sanitizer.STRING_ARRAY)).to.be.true;
      expect(sanitizer.isSanitized("abc,abc", sanitizer.STRING_ARRAY)).to.be.true;
    });
    it('should return false when expected string array is not an array', function(){
      expect(sanitizer.isSanitized("abc342", sanitizer.STRING_ARRAY)).to.be.false;
      expect(sanitizer.isSanitized("abc-fds", sanitizer.STRING_ARRAY)).to.be.false;
      expect(sanitizer.isSanitized("abc;'fds", sanitizer.STRING_ARRAY)).to.be.false;
    });
  });
  describe('#sanitizeReq()', function(){
    it('should return null for successful inputs', function(){
      var inputs = {"int" : sanitizer.INT, "string" : sanitizer.STRING, "float" : sanitizer.FLOAT};
      var params = {"int" : "1234", "string" : "String", "float" : "-123.432"};
      expect(sanitizer.sanitizeReq(params, inputs)).to.be.null;
    });
    it('should return an object for unsuccessful inputs', function(){
      var inputs = {"int" : sanitizer.INT, "string" : sanitizer.STRING, "float" : sanitizer.FLOAT};
      var params = {"int" : "12f34", "string" : "Hello world", "float" : "-123.4fd32"};
      var result = sanitizer.sanitizeReq(params,inputs);  
      assert.equal(result.size, 3);
    });
    it('should concatenate error results', function(){
      var inputs = {"int" : sanitizer.INT, "string" : sanitizer.STRING, "float" : sanitizer.FLOAT};
      var params = {"int" : "12f34", "string" : "Hello world", };
      var result = sanitizer.sanitizeReq(params,inputs);  
      assert.equal(result.size, 2);
      params = {"float" : "-123.4fd32"};
      result = sanitizer.sanitizeReq(params,inputs, result);  
      assert.equal(result.size, 3);
      
    });
  });
});
