/* global require:false, process:false, __dirname: false */

var express = require('express'),
    path = require('path'),
    slots = require('./models/slots.js');

var app = express();

app.set('port', process.env.PORT || 3000);
app.use(express.bodyParser());
app.use(express.logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

//Adding error handler to dev environment to ease debugging
if (app.get('env') === 'development') {
  app.use(express.errorHandler());
}

app.get("/slots/:latitude;:longitude", slots.all);

var server = app.listen(app.get('port'));