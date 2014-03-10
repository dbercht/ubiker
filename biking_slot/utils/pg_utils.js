var pg = require('pg');
var conString = process.env.PG_CON_STRING || "postgres://postgres:postgres@localhost:5432/biking";

exports.query = function(res, query, params, callback) {
  pg.connect(conString, function(err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }
    client.query (query,  params, function(err, result) {
        done();

        if (err) {
          //console.log(err);
          if (res) {
            res.send(500);
          } else {
            callback(undefined);
          }
        } else {
          callback(result);
        }
    });
  });
};

exports.rollback = function(client, done) {
  client.query("ROLLBACK", function(err) {
    return done(err);
  });
};

exports.buildInClause = function(key, req, paramType, params, alias, includeAnd) {
  //Adding status/placement param if it exists
  if (key in req[paramType]) {
    var queryParams = req[paramType][key].split(",");
    var vals = [];
    for (var i = 0; i < queryParams.length; i++) {
      params.push(queryParams[i]);
      vals.push("$" + params.length);
    }
    return (includeAnd === true? "AND " : "") + alias + " IN (" + vals.join(", ") + ") ";
  } else {
    return "";
  }
};
