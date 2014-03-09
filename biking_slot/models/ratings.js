/* global require: false, exports: false */
var pgUtil = require('../utils/pg_utils.js');
var inputSanitizer = require('../utils/sanitizer.js');
var slots  = require('./slots.js');

/**
 * Methods for authenticated users to rate a slot
 * Restriction: 1 rating per slot per user
 */
exports.create = function(req, res) {
  var errors = inputSanitizer.sanitizeReq(req.params, slots.inputs);
  errors = inputSanitizer.sanitizeReq(req.body, slots.inputs, errors);

  if (errors) {
    return res.send(400, errors);
  }
  var params = [
    req.user.id,
    req.params.slot_id,
    req.body.rating
    ];
  for (var i  = 0; i< params.length; i++) {
    if (params[i] === undefined) return res.send(400, {message : { "Expected" : "rating" } } );
  }

  var deleteQuery = "DELETE FROM rating " + 
    "WHERE user_id = $1 " +  
    "AND parking_slot_id = $2;";
  var createQuery = 
    "INSERT INTO " +
    "rating ( user_id, parking_slot_id, val ) " +
    "values ( $1, $2, $3 )";

  pgUtil.query(res,
      deleteQuery,
      params.slice(0,2),
      function() {
        pgUtil.query(res,
          createQuery,
          params,
          function() {
            res.send(200);
          });
      });
};

