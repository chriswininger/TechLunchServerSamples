/*
	Defining paths
		also mention post and push
 */

var express = require('express');
var app = express();
var port = 3000;

app.get('/:pageName', function (req, res) {
	res.send('you asked for ' + req.params.pageName);
});

// will we ever get here?
app.get('/special', function(req, res) {
	res.send('you found my special place');
});

app.get('/', function(req, res) {
	res.send('Hello World');
});

app.listen(port);

console.log('listening on port ' + port);

/*
 app.get('/:pageName', function (req, res, next) {
 	if (req.params.pageName === 'special')
 		return next();
 	res.send('you asked for ' + req.params.pageName);
 });


 app.get('/:pageName?', function (req, res) {
 	if (!req.params.pageName)
 		return res.send('you asked for an empty page');

 	res.send('you asked for ' + req.params.pageName);
 });
 */