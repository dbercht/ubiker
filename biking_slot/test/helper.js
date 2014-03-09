/* global exports: false, require: false  */
var request = require('supertest');

var pgUtils = require('../utils/pg_utils.js');

var newUser = function(username, email, password, id) {
  return {
    username: username, email: email, password: password, id: id
  };
};
var newSlot = function(id, location, address, racks, spaces, lat, lng, placement_id, status_id) {
  return {
    id : id, location : location, address : address, racks: racks, spaces : spaces, lat : lat, lng : lng, placement_id : placement_id, status_id: status_id
  };
};
var users = [
  newUser('dan', 'user1@email.com', 'password', 1),
  newUser('dan', 'user2@email.com', 'password', 2)
];

var slots = [
  ['dan', 'user1@email.com', 'password', 1],
  ['dan', 'user2@email.com', 'password', 2]
];

exports.getUserLoginCookie = function(app, userId, cookieSetter, done) {
      request(app)
      .post('/login')
      .send({
        email : users[userId].email,
        password : users[userId].password,
      })
      .expect(200)
      .end(function(err, res) {
        cookieSetter(res.headers['set-cookie']);
        done();
      });
};

exports.creatTestSlot  = function(id, done){ 
};
exports.createTestUser = function(id, done){ 
  if (id === undefined) id = 0;
  pgUtils.query(null,
      'INSERT INTO users (username, email, password, id) values( $1, $2, $3, $4)',
      [users[id].username, users[id].email, users[id].password, users[id].id],
      function() {
        done();
      });
};

exports.resetData = function(done){ 
  pgUtils.query(null,
      'DELETE from request',
      [],
      function() {
        pgUtils.query(null,
          'DELETE from rating',
          [],
          function() {
            pgUtils.query(null,
              'DELETE from users',
              [],
              function() {
                done();
              });
          });
      });
};

exports.users = users;
