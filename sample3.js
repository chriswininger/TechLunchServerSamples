/*
	Middleware pattern
 */

var express = require('express');
var app = express();

app.get('/', [_doSomeUsefulAction1, _doSomeUsefulAction2], function(req, res) {
	res.send('Hello ' + req.user + ', the time is ' + req.time);
});

app.listen(3000);

console.log('listening on port 3000');

function _doSomeUsefulAction1(req, res, next) {
	req.user = 'Bob Vance';
	next();
}

function _doSomeUsefulAction2(req, res, next) {
	req.time = Date.now();
	next();
}
