var connect = require("connect");

var port = (process.env.VCAP_APP_PORT || 3000);
var host = (process.env.VCAP_APP_HOST || 'localhost');
var http = require('http');

var app = connect().use(connect.static(__dirname + '/public'))


http.createServer(app).listen(port,host);

