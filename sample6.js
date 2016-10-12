/*
	Demonstrate socket.io
 */

const express = require('express');
const session = require('express-session');
const app = express();
const http = require('http').Server(app);

// in addition to setting up socket.io this exposes /socket.io/socket.io.js over http
const io = require('socket.io')(http);

// lets bring in a template engine for this one (NO DEMO COMPLETE WITHOUT PUGS!!!)
app.set('view engine', 'pug');
app.set('views', __dirname + '/views/sample6');

// === http routes ===
// nothing dynamic here, no real need for template, but they are easier to read so why not?
app.get('/', function(req, res) {
	console.log('handling home page');
	res.render('home', {});
});
app.use('/src', express.static('public/src/sample6'));

// === Socket.io routes ===
io.on('connection', function(socket) {
	console.log('user connected on socket: ' + socket.id);

	socket.on('message', function(msg) {
		console.log('received message (socket: %s): %s', socket.id, JSON.stringify(msg, null, 4));
		// sends to everyone but socket (could also do io.emit to include our self)
		socket.broadcast.emit('message', msg);
	});

	socket.on('disconnect', function() {
		console.log('user disconnected ' + socket.id);
	});
});

// === Start listening ===
http.listen(3000);

console.log('listening on port 3000');
