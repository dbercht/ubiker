/* global require: false  */
var request = require('supertest');

var pgUtils = require('../utils/pg_utils.js');

var users = [
  [],
  ['dan', 'user1@email.com', 'password', 1],
  ['dan', 'user2@email.com', 'password', 2]
];

exports.getUserLoginCookie = function(app, userId, cookieSetter, done) {
      request(app)
      .post('/login')
      .send({
        email : users[userId][1],
        password : users[userId][2],
      })
      .expect(200)
      .end(function(err, res) {
        cookieSetter(res.headers['set-cookie']);
        done();
      });
};

exports.createTestUser = function(id, done){ 
  if (id === undefined) id = 1;
  pgUtils.query(null,
      'INSERT INTO users (username, email, password, id) values( $1, $2, $3, $4)',
      users[id],
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
