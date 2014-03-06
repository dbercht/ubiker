/* global require:false */

var express = require('express');
var app = express();

app.set('port', process.env.PORT || 3000);
app.use(express.bodyParser());
app.use(express.static(path.join(__dirname, 'public')));

//Adding error handler to dev environment to ease debugging
if (app.get('env') === 'development') {
     app.use(express.errorHandler());
};

app.listen(app.get('port'));