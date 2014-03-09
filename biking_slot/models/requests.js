/* global require: false, exports: false */
var pgUtil = require('../utils/pg_utils.js');
var inputSanitizer = require('../utils/sanitizer.js');
var slots  = require('./slots.js');

exports.CURRENT_INTERVAL_HOURS  = 12;

/**
 * Helper function to build the interval function
 */
var slotValidInterval = function(alias) {
  if (alias === undefined || alias === null) {
    alias = "";
  } else {
    alias += ".";
  }

  return "coalesce( " + alias + "date_requested, NOW()) + interval '" + exports.CURRENT_INTERVAL_HOURS + " hours' > NOW()";
};
/**
 * Method for authenticated users to request a slot
 * Restriction: A user must only have one active request in the span on 24 hours
 *              His active request will be removed to create another one
 */
exports.create = function(req, res) {
  var errors = inputSanitizer.sanitizeReq(req.params, slots.inputs);

  if (errors) {
    return res.send(400, errors);
  }
  var params = [
    req.user.id,
    req.params.slot_id,
    ];

  var deleteQuery = "DELETE FROM request " + 
    "WHERE user_id = $1 " +  
    "AND " + slotValidInterval();

  var createQuery = 
    "INSERT INTO " +
    "request ( user_id, parking_slot_id ) " +
    "values ( $1, $2 )";

  pgUtil.query(res,
      deleteQuery,
      params.slice(0,1),
      function(result) {
        pgUtil.query(res,
          createQuery,
          params,
          function() {
            res.send(200);
          });
      });
};
exports.getRequest = function(user_id, slot_id, done) {
  var query = 'SELECT * ' + 
    'FROM request ' + 
    'WHERE user_id = $1 AND parking_slot_id = $2 AND ' + slotValidInterval() + 
    'ORDER BY date_requested DESC';
  pgUtil.query(null,
      query,
      [user_id, slot_id],
      function(results) {
        if (results.rows.length === 0) {
          done(true);
        } else {
          done(null, results.rows[0]);
        }
      }
      );
};

exports.slotValidInterval = slotValidInterval;
