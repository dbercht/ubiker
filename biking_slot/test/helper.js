/* global exports: false, require: false  */
var request = require('supertest');
var pgUtils = require('../utils/pg_utils.js');

/**
 * Instantiating a user object
 */
var newUser = function(username, email, password, id) {
  return {
    username: username, email: email, password: password, id: id
  };
};
/**
 * Instantiating a slot object
 */
var newSlot = function(id, location, address, racks, spaces, lat, lng, placement_id, status_id) {
  return {
    id : id, location : location, address : address, racks: racks, spaces : spaces, lat : lat, lng : lng, placement_id : placement_id, status_id: status_id
  };
};
/**
 * User fixtures
 */
var users = [
  newUser('dan', 'user1@email.com', 'password', 1),
  newUser('dan', 'user2@email.com', 'password', 2)
];

/**
 * Slot fixtures
 */
var slots = [
  newSlot(1, 'location', 'address', 10, 10, 0.010, 0.010, 1, 1),
  newSlot(2, 'location2', 'address2', 5, 5, 0.011, 0.011, 2, 2),
  newSlot(3, 'location3', 'address3', 5, 5, 0.012, 0.012, 3, 1),
];

/**
 * Helper to mock a request with auser logged in
 */
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

/**
 * Creating test slot in the database
 */
exports.createTestSlot = function(id, done){ 
  if (id === undefined) id = 0;
  pgUtils.query(null,
      'INSERT INTO ' +
      'parking_slot (id, location_name, address, spaces, racks, latitude, longitude, placement_id, status_id) ' +
      'values( $1, $2, $3, $4, $5, $6, $7, $8, $9)',
      [slots[id].id, slots[id].location, slots[id].address, slots[id].spaces, slots[id].racks, slots[id].lat, slots[id].lng, slots[id].placement_id, slots[id].status_id],
      function() {
        done();
      });
};
/**
 * Creating test user in the database
 */
exports.createTestUser = function(id, done){ 
  if (id === undefined) id = 0;
  pgUtils.query(null,
      'INSERT INTO users (username, email, password, id) values( $1, $2, $3, $4)',
      [users[id].username, users[id].email, users[id].password, users[id].id],
      function() {
        done();
      });
};

/**
 * Reseting all data in the db
 */
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
                pgUtils.query(null,
                  'DELETE from parking_slot where id < 100',
                  [],
                  function() {
                    done();
                  });
              });
          });
      });
};

exports.users = users;
