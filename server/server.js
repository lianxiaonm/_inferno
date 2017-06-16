var express = require('express');
//最下面
var https = require('http');
var fs = require("fs");

var path = require('path');
var favicon = require('static-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cons = require('consolidate');
var logger = require("./helpers/log");
var route = require("./config/route");
var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
// assign the swig engine to .html files
app.engine('html', cons.swig);
// set .html as the default extension 
app.set('view engine', 'html');
app.use(favicon());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());

// initialize application route config.
route.init(app);
https.createServer(app).listen(30001, function() {
    logger.debug(
        'node web server connection successfully Express server listening on port 30001 !'
    );
});

// command line $>> npm start
module.exports = app;
