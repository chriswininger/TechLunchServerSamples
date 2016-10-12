/*
 	Demonstrate authentication
 */

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const MongoStore = require('connect-mongo')(session);
const app = express();

// === Built in users (this is a terrible idea, don't do this ===
const users = [
	{
		id: 0, // also my index
		name: 'Dade Murphy',
		userName: 'zeroCool',
		password: '4321'
	},
	{
		id: 1,
		name: ' Kevin Mitnick',
		userName: 'kMitnick',
		password: 'asd'
	},
	{
		id: 2,
		name: 'Adrian Lamo',
		userName: 'lamo',
		password: 'xxx'
	}
];

// === passport settings ===
passport.use(new LocalStrategy(
	function(userName, password, complete) {
		console.log('authenticating using local strategy');

		var user = _getUserByName(userName);

		console.log('search for user ' + userName + ' returned the user ' + JSON.stringify(user, null, 4));

		if (!user)
			return complete(null, false);

		// if you put stuff like this in your logs you are doomed, remember logs are often stored
		console.log('checking password ' + user.password + ' === ' + password);
		if (user.password === password)
			return complete(null, user);

		console.log('password check failed back to login page for you');
		complete(null, false);
	}
));

passport.serializeUser(function(user, complete) {
	complete(null, user.id);
});

passport.deserializeUser(function(id, complete) {
	// id is also the index in this example
	complete(null, users[id]);
});
// === app middleware stack ===
app.use(require('cookie-parser')()); // needed for passport to work
app.use(require('body-parser').urlencoded({ extended: true })); // needed for passport to work
app.use(session({
	secret: 'foo',
	resave: true,
	saveUninitialized: true,
	store: new MongoStore({
		url: 'mongodb://localhost/test-app'
	})
}));
app.use(passport.initialize());
app.use(passport.session());
// === routes ===

// lets bring in a template engine for this one (NO DEMO COMPLETE WITHOUT PUGS!!!)
app.set('view engine', 'pug');
app.set('views', __dirname + '/views/sample5');

app.get('/', [_ensureAuthenticated], function(req, res) {
	console.log('handling home page');
	res.render('home', { userName: req.user.name });
});

app.get('/login', function(req, res) {
	console.log('handling login page request');
	res.render('login', {});
});

// passport is placed in middleware stack, hands off to our method on success
app.post(
	'/login',
	[passport.authenticate('local', {
		failureRedirect: '/login'
	})], function(req, res) {
		// success, user no authenticated
		res.redirect('/');
	}
);

app.post('/logout', function(req, res) {
	console.log('user is logging out')
	req.logout();
	res.redirect('/')
});

// === Start listening ===
app.listen(3000);

console.log('listening on port 3000');

// === Helpers ===
function _ensureAuthenticated(req, res, next) {
	console.log('checking authentication for request at ' + req.url);

	if (req.isAuthenticated()) {
		console.log('request authenticated for ' + req.url);
		return next();
	}

	console.log('request not authenticated for ' + req.url + ' redirecting to login');
	res.redirect('/login');
}

function _getUserByName(userName) {
	var user;
	for (var i = 0; i < users.length; i++) {
		if (users[i].userName === userName) {
			user = users[i];
			break;
		}
	}

	return user;
}