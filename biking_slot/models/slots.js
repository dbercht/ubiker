/* global require: false, exports: false */
var pgUtil = require('../utils/pg_utils.js');
var inputSanitizer = require('../utils/sanitizer.js');
var converter = require('../utils/converter.js');

//Default radius in miles
var DEFAULT_RADIUS = 5;
//Default results limit 
var DEFAULT_LIMIT = 20;

var inputs = {
  "id" : inputSanitizer.INT,
  "radius" : inputSanitizer.INT,
  "status" : inputSanitizer.STRING_ARRAY,
  "location" : inputSanitizer.STRING_ARRAY,
  "latitude" : inputSanitizer.FLOAT,
  "longitude" : inputSanitizer.FLOAT,
};

exports.all = function(req, res) {
  var errors = inputSanitizer.sanitizeReq(req.query, inputs);
  errors  = inputSanitizer.sanitizeReq(req.params, inputs, errors);
  var radius = "radius" in req.query ? req.query.radius : DEFAULT_RADIUS;
  var limit = "limit" in req.query ? req.query.limit : DEFAULT_LIMIT;

  var query = "SELECT *, sqrt((ps.latitude - $1)^2+(ps.longitude - $2)^2) as distance"+
    "FROM parking_slot ps " +
    "LEFT JOIN status s ON s.id = ps.status_id " +
    "LEFT JOIN placement p ON p.id = ps.placement_id " +
    "WHERE distance <= $3 " +
    "ORDER BY distance ASC " +
    "LIMIT $4";

  var params = [
      req.params.latitude,
      req.params.longitude,
      converter.milesToDegrees(radius),
      limit,

    ];


  if (errors) {
    res.send(400, errors);
  } else {
    pgUtil.query (res,
        query,
        params,
        function(result) {
          res.send(result.rows);
        });
  }
};

