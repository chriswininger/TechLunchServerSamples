(function() {
	var socket = io();

	document.addEventListener('DOMContentLoaded', function(){
		document.getElementById('btnSend').addEventListener('click', function(e) {
			var messageVal = document.getElementById('message').value;
			socket.emit('message', { value: messageVal });
		}, false);
	});

	socket.on('message', function(msg) {
		alert('another user says: ' + msg.value);
	});
})();
