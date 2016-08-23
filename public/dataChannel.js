// DIRECTIONS, from server

// selected elements from index.html that show information, allows for programmatic updating
var heightArea = document.querySelector("#heightArea");
var distArea = document.querySelector("#distArea");
var signalingArea = document.querySelector("#signalingArea");

// *we need to create our own stun server, look into toolio
// *set room name = to random string from req.params url
// signaling variables setup:
// SIGNAL_ROOM = name of room we test our game in, soon to be programmatic for multiple rooms/users
// iceServers connects to development server hosted by Google, negotiates NAT/firewalls
// iceServers (STUN or TURN) technically not required in dev environment
var SIGNAL_ROOM = "signaling";
var configuration = {
	'iceServers': [{
		'url': 'stun:stun.l.google.com:19302'
	}]
};

// initializes rtcPeerConn variable for P2P connection object
// dataChannel for specific dataChannel object
var rtcPeerConn;
var dataChannel;
var dataChannelOptions = {
	reliable: false,
	ordered: false, //no guaranteed delivery, unreliable but faster
	maxRetransmitTime: 1000, //milliseconds
};

// P2P information needed for game logic
var peerFound = false;
var moved = false;

// set up socket connection between client and server for signaling
io = io.connect();

// io.configure(function () {
//   io.set("transports", ["xhr-polling"]);
//   io.set("polling duration", 20);
// });

displaySignalMessage('Waiting for other player...')

// emits event to server setting up unique room
// DIRECTIONS, to server.js
io.emit('ready', {"signal_room": SIGNAL_ROOM});

// DIRECTIONS, on setting up unique room
// sends a first signaling message to anyone in room listening
io.emit('signal',{"type":"user_here", "message":"Let's play the CopernicusGame!", "room":SIGNAL_ROOM});

io.on('signaling_message', function(data) {
	if (data.type === "user_here") displaySignalMessage('Player 2 is joining...');
	setTimeout(transitionGameMessages, 10000);

	peerFound = true;

	// set up the RTC Peer Connection object
	if (!rtcPeerConn) {
		startSignaling();
	}

	// if user isn't the first user to join the page, peerConnect obj is already set up, so simply respond with description
	if (data.type != "user_here") {
		var message = JSON.parse(data.message);
		if (message.sdp) {
			sendRemoteDesc(message.sdp);
		}
		// if descriptions for each peer already set up, set ICE candidates
		else {
			rtcPeerConn.addIceCandidate(new RTCIceCandidate(message.candidate));
			// console.log('Setting ICE candidate: ', message.candidate);
		}
	}

});

function startSignaling() {
	rtcPeerConn = new webkitRTCPeerConnection(configuration, {optional: []});
	dataChannel = rtcPeerConn.createDataChannel('positionMessages', dataChannelOptions);
	// console.log('dataChannel created', dataChannel);

	// send any ice candidates to the other peer
	rtcPeerConn.onicecandidate = function (evt) {
		if (evt.candidate && rtcPeerConn.remoteDescription.type.length > 0) {
			// console.log('Created ICE candidate, now sending: ', evt.candidate);
			io.emit('signal',{"type":"ice candidate", "message": JSON.stringify({ 'candidate': evt.candidate }), "room":SIGNAL_ROOM});
		};
	};

	// let the 'negotiationneeded' event trigger offer generation
	rtcPeerConn.onnegotiationneeded = function () {
		// console.log("On negotiation called");
		if (rtcPeerConn.remoteDescription.type.length === 0) rtcPeerConn.createOffer(sendLocalDesc, logError);
	}

	// let these dataChannel events trigger dataChannel methods
	dataChannel.onerror = logError;
	dataChannel.onmessage = receiveDataChannelMessage;
	dataChannel.onopen = dataChannelStateChanged;
	rtcPeerConn.ondatachannel = receiveDataChannel;
}

// sends local description
function sendLocalDesc(desc) {
	rtcPeerConn.setLocalDescription(desc, function () {
		// console.log('Sending local description: ', rtcPeerConn.localDescription);
		io.emit('signal',{"type":"SDP", "message": JSON.stringify({ 'sdp': rtcPeerConn.localDescription }), "room":SIGNAL_ROOM});
	}, logError);
}

// sends remote description
function sendRemoteDesc(desc) {
	// console.log('Received message.sdp: ', desc);
	rtcPeerConn.setRemoteDescription(new RTCSessionDescription(desc), function () {
		// if we received an offer, we need to answer
		// console.log('Received remote description, and set it: ', rtcPeerConn.remoteDescription)
		if (rtcPeerConn.remoteDescription.type == 'offer') {
			rtcPeerConn.createAnswer(sendLocalDesc, logError);
		}
	}, logError);
}

//Data Channel Specific methods
function dataChannelStateChanged() {
	if (dataChannel.readyState === 'open') {
		dataChannel.onmessage = receiveDataChannelMessage;
	}
}

function receiveDataChannel(event) {
	// console.log('Event in receiveDataChannel: ', event)
	dataChannel = event.channel;
}

function receiveDataChannelMessage(event) {
	var received = JSON.parse(event.data);
	if (received.position) {
		message = received;
		displayMessage('Height: ' + parseFloat(message.position[1] - .3).toFixed(3), 'Distance: ' + parseFloat(7 + message.position[0]).toFixed(3));
	} else if (received.moved) {
		moved = received.moved;
	} else if (received.turn) {
		user.myTurn = received.turn;
		scene.remove(ball2);
		addBall();
		user.pointFlag = true;
	} else if (received.points) {
		otherUser.points += received.points;
		if (user.player === "user_1") $('#p2Points').text(otherUser.points);
		else $('#p1Points').text(otherUser.points);
	}
}

//Logging/Display Methods
function logError(error) {
	// console.log(error.name + ': ' + error.message);
}

function displayMessage(message1, message2) {
	heightArea.innerHTML = message1;
	distArea.innerHTML = message2;
}

function displaySignalMessage(message) {
	signalingArea.innerHTML = message;
}

function transitionGameMessages() {
	$('#signalingArea').fadeOut();

	$('#pointsDiv').delay(1000).fadeIn(100).animate({ "marginTop": "-100%" });
	if (user.myTurn === true) $('#throwBall').delay(1000).fadeIn(100).animate({ "marginTop": "-100%" });
	else $('#throwBall').text("Please wait for the other player to take his turn!").delay(1000).fadeIn(100).animate({ "marginTop": "-100%" });
}

function addGameLogic() {
  $('#spotlight').append( `<script id=` + `"gamescript"` + `type=` + `"text/javascript"` + ` src=` + `"public/gameLogic.js"` + `></script>` );
}

setTimeout(addGameLogic, 2000);
