var express = require("express");
var app = express();
var server = require('http').createServer(app).listen(process.env.VCAP_APP_PORT || 8080);
var path = require('path');

app.use(express.static(path.join(__dirname, 'app')));

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/app/index.html');
});