/* global require: false, exports: false */
var pgUtil = require('../utils/pg_utils.js');
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    bcrypt = require('bcrypt-nodejs'),
    users = require('./users.js');

/**
 * Using email/password combo
 * Boilerplate: https://github.com/jaredhanson/passport-local/blob/master/examples/express3-no-connect-flash/app.js
 */
passport.use(new LocalStrategy(
      { usernameField: 'email' },
  function(email, password, done) {
    process.nextTick(function () {
      users.findByEmail(email, function(err, user) {
        if (err) { return done(err); }

        if (!user || !bcrypt.compareSync(password, user.password) ) { return done(null, false, {}); }
        delete user.password;
        return done(null, user);
      });
    });
  }
));

/*
 * Boilerplate: https://github.com/jaredhanson/passport-local/blob/master/examples/express3-no-connect-flash/app.js
 */
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

/*
 * Boilerplate: https://github.com/jaredhanson/passport-local/blob/master/examples/express3-no-connect-flash/app.js
 */
passport.deserializeUser(function(id, done) {
  users.findById(id, function (err, user) {
    delete user.password;
    done(err, user);
  });
});

/**
 * Basic function to ensure authentication
 */
exports.ensureAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.send(401);
};

/**
 * Route to logout
 */
exports.logout =  function(req, res) {
  req.logout();
  res.send(200);
};
/**
 * Current session information (if user is already logged in)
 */
exports.login =  function(req, res) {
  res.send({ user : req.user });
};

exports.authenticate = function() {
  return passport.authenticate('local');
};
