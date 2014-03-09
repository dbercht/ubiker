/* global require: false, exports: false */
var pgUtil = require('../utils/pg_utils.js');

/**
 * Function to create a user
 */
exports.create = function(req, res) {
  var params =  [ req.body.username, req.body.email, req.body.password ];
  for (var i = 0; i < params.length; i++) {
    if (params[i] === undefined) { return res.send(400); }
  }

  var query = "INSERT INTO " +
    "users (username, email, password) " +
    "VALUES ( $1, $2, $3 )";

  pgUtil.query(res,
      query,
      params,
      function(result) {
        res.send(201);
      }
      );
};

/**
 * Passport function to ind user by id
 */
exports.findById = function(value, done) {
  return findByCol('id', value, done);
};

/**
 * Passport function to ind user by email
 */
exports.findByEmail = function(value, done) {
  return findByCol('email', value, done);
};

/**
 * Generic function to find user by a column
 */
var findByCol = function(column, value, done) {
  //Don't forget to unset the password field!!!!
  var query = "SELECT * " +
    "FROM users " +
    "WHERE "+column+"= $1 " +
    "LIMIT 1";
  pgUtil.query (null,
      query,
      [ value ],
      function(result) {
        if (result === undefined) {
          return done(true);
        }
        if (result.rows.length === 0) {
          return done(true); 
        } else {
          return done(null, result.rows[0]);
        }
      });
};
