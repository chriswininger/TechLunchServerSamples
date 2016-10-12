/*
	Simple Session Demo,
		show how we can kill the server and it comes back
 */

const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const app = express();
app.use(session({
	secret: 'foo',
	resave: true,
	saveUninitialized: true,
	store: new MongoStore({
		url: 'mongodb://localhost/test-app'
	})
}));

app.get('/', function(req, res) {
	if (!req.session.count)
		req.session.count = 0;

	req.session.count++;
	res.send('you have done this ' + req.session.count + ' time(s)');
});

app.listen(3000);

console.log('listening on port 3000');