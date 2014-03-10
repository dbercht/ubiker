/* global require: false, exports: false */
var pgUtil = require('../utils/pg_utils.js');
var inputSanitizer = require('../utils/sanitizer.js');
var converter = require('../utils/converter.js');
var requests = require('./requests.js');

//Default radius in miles
var DEFAULT_RADIUS = 10;
//Default results limit 
var DEFAULT_LIMIT = 20;

var inputs = {
  "id" : inputSanitizer.INT,
  "radius" : inputSanitizer.INT,
  "status" : inputSanitizer.STRING_ARRAY,
  "placement" : inputSanitizer.STRING_ARRAY,
  "latitude" : inputSanitizer.FLOAT,
  "longitude" : inputSanitizer.FLOAT,
  "rating" : inputSanitizer.INT,
};

/**
 * All function returns all slots within a given radius of the incoming lat/lon coordinates (req.params)
 *
 */
exports.all = function(req, res) {
  var errors = inputSanitizer.sanitizeReq(req.query, inputs);
  errors  = inputSanitizer.sanitizeReq(req.params, inputs, errors);
  if (errors) {
    res.send(400, errors);
  } else {
    var queryObj = buildAllQuery(req);
    pgUtil.query (res,
        queryObj.query,
        queryObj.params,
        function(result) {
          //Returning results
          for (var i = 0; i < result.rows.length; i++) {
            result.rows[i].distance = converter.degreesToMiles(result.rows[i].distance); 
          }
          res.send(result.rows);
        });
  }
};


/**
 * buildAllQuery - Build query for the 'all' functionality of slots
 */
var buildAllQuery = function(req) {
  var radius = "radius" in req.query ? req.query.radius : DEFAULT_RADIUS;
  var limit = "limit" in req.query ? req.query.limit : DEFAULT_LIMIT;

  var params = [
      req.params.latitude,
      req.params.longitude,
      converter.milesToDegrees(radius),
      limit
        ];
  var user = req.user;
  if (user ) params.push(user.id);

  var query = "SELECT " +
      "ps.id, "+ 
      "ps.location_name as location, " + 
      "ps.address, " + 
      "ps.spaces, " + 
      "ps.racks, " + 
      "ps.latitude, " + 
      "ps.longitude, " + 
      "p.name as placement, " + 
      "s.name as status, " +
      "sqrt((ps.latitude - $1)^2+(ps.longitude - $2)^2) as distance, " +
      "COALESCE(AVG(average_rating.val), 0) as rating, " +
      "COALESCE(COUNT(average_rating), 0) as num_ratings, " +
      "COALESCE(COUNT(req), 0) as pending_requests, " +
      "COALESCE(COUNT(total_requests), 0) as total_requests ";
    if (user) {
      query = query + ", user_rating.val as user_rating, " + 
      " user_request.date_requested as user_requested "; 
    }
    query = query + "FROM parking_slot ps " +
    "LEFT JOIN status s ON s.id = ps.status_id " +
    "LEFT JOIN placement p ON p.id = ps.placement_id " +
    "LEFT JOIN rating average_rating ON average_rating.parking_slot_id = ps.id " +
    "LEFT JOIN request req ON req.parking_slot_id = ps.id " +
    "LEFT JOIN request total_requests ON total_requests.parking_slot_id = ps.id ";

    if (user) {
      query = query + "LEFT JOIN rating user_rating on user_rating.parking_slot_id = ps.id AND  user_rating.user_id = $5 " + 
      " LEFT JOIN request user_request on user_request.parking_slot_id = ps.id AND user_request.user_id = $5 AND " + requests.slotValidInterval('user_request') + " "; 
    };

    query = query + "WHERE ps.latitude > $1 - $3 AND ps.latitude < $1 + $3 AND ps.longitude < $2 + $3 AND ps.longitude > $2 - $3 " +
    "AND " + requests.slotValidInterval("req") + " " +
    pgUtil.buildInClause('status', req, 'query', params, 's.name', true) +    
    pgUtil.buildInClause('placement', req,  'query', params, 'p.name', true) +   
     
    "GROUP BY " +
      "ps.id, "+ 
      "location, " + 
      "address, " + 
      "spaces, " + 
      "racks, " + 
      "latitude, " + 
      "longitude, " + 
      "placement, " + 
      "status, " +
      "distance ";
    if (user) {
      query += ", user_rating " +
      ", user_requested ";
    }
    query += "ORDER BY distance ASC " +
    "LIMIT $4";
  return { 'query' : query, 'params' : params };
};

exports.buildAllQuery = buildAllQuery;
exports.inputs = inputs;
