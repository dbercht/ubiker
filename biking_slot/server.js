/* global require:false, process:false, __dirname: false */

var express = require('express'),
    path = require('path'),
    passport = require('passport'),
    slots = require('./models/slots.js'),
    requests = require('./models/requests.js'),
    ratings = require('./models/ratings.js'),
    users = require('./models/users.js'),
    auth = require('./models/auth.js');

var app = express();

app.set('port', process.env.PORT || 3000);
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({ secret: 'uberuberuberuber'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

//Adding error handler to dev environment to ease debugging
if (app.get('env') === 'development') {
  app.use(express.errorHandler());
}

app.get("/slots/:latitude;:longitude", slots.all);
app.post("/slots/:slot_id/ratings", auth.ensureAuthenticated, ratings.create);
app.post("/slots/:slot_id/requests", auth.ensureAuthenticated, requests.create);

app.post('/users', users.create);

app.get('/login', auth.ensureAuthenticated, function(req, res) { return res.send({user: req.user});});
app.post('/login', auth.authenticate(), auth.login);
app.del('/login', auth.ensureAuthenticated, auth.logout);

exports.runningServer = app.listen(app.get('port'));
exports.app = app;
