var connect = require("connect");

var port = (process.env.PORT || 3000);
var http = require('http');

var app = connect().use(connect.static(__dirname + '/public'))


http.createServer(app).listen(port);

