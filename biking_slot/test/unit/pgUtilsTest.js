/* global require: false */

var pg = require("../../utils/pg_utils.js");
var assert = require("assert");

describe('PGUtils', function(){
  describe('#builIndClause()', function(){
    it('should build appropriate in clause', function(){
      var req = { 'query' : { 'status' : '1' } };
      params= [];
      assert.equal(
        pg.buildInClause('status', req, 'query', params, 'alias'),
        "alias IN ($1) "
        );
      assert.equal(
        params.join("-"),
        ["1"]
        );
    });
    it('should build appropriate in clause for arrays with prior params', function(){
      var req = { 'query' : { 'status' : '1,2' } };
      params= ["something else"];
      assert.equal(
        pg.buildInClause('status', req, 'query', params, 'alias'),
        "alias IN ($2, $3) "
        );
      assert.equal(
        params.join("-"),
        ["something else-1-2"]
        );
    });
    it('should include AND clause if required', function(){
      var req = { 'query' : { 'status' : '1,2' } };
      params= ["something else"];
      assert.equal(
        pg.buildInClause('status', req, 'query', params, 'alias', true),
        "AND alias IN ($2, $3) "
        );
    })
  });
});
