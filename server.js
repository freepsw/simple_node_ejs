var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var fs = require("fs")
var redis = require('redis');
var JSON = require('JSON');

redis_conn = redis.createClient(6379, '1.234.69.44');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
 
 
var server = app.listen(3000, function(){
 console.log("Express server has started on port 3000")
});
 
app.use(express.static('public'));
 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(session({
 secret: '@#@$MYSIGN#@$#$',
 resave: false,
 saveUninitialized: true
}));
 
 
var router = require('./router/main')(app, fs, redis);
