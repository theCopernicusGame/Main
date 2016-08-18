//Page controls
var heightArea = document.querySelector("#heightArea");
var distArea = document.querySelector("#distArea");
var signalingArea = document.querySelector("#signalingArea");

// WE NEED TO CREATE OUR OWN STUN SERVER, LOOK INTO TOOLIO
//Signaling Code Setup
var SIGNAL_ROOM = "signaling";
var configuration = {
	'iceServers': [{
		'url': 'stun:stun.l.google.com:19302'
	}]
};
var rtcPeerConn;
var dataChannelOptions = {
	reliable: false,
	ordered: false, //no guaranteed delivery, unreliable but faster
	maxRetransmitTime: 1000, //milliseconds
};

var dataChannel;

io = io.connect();

io.emit('ready', {"signal_room": SIGNAL_ROOM});

//Send a first signaling message to anyone listening
//In other apps this would be on a button click, we are just doing it on page load
io.emit('signal',{"type":"user_1", "message":"Would you like to play a game?", "room":SIGNAL_ROOM});

io.on('signaling_message', function(data) {
	displaySignalMessage("Signal received: " + data.type);
	//Setup the RTC Peer Connection object
	if (!rtcPeerConn) {
		startSignaling();
	}

	if (data.type != "user_1") {
		var message = JSON.parse(data.message);
		if (message.sdp) {
			console.log('Received message.sdp: ', message.sdp);
			rtcPeerConn.setRemoteDescription(new RTCSessionDescription(message.sdp), function () {
				// if we received an offer, we need to answer
				console.log('Received remote description, and set it: ', rtcPeerConn.remoteDescription)
				if (rtcPeerConn.remoteDescription.type == 'offer') {
					rtcPeerConn.createAnswer(sendLocalDesc, logError);
				}
			}, logError);
		}
		else {
			rtcPeerConn.addIceCandidate(new RTCIceCandidate(message.candidate));
			console.log('Setting ICE candidate: ', message.candidate);
		}
	}

});

function startSignaling() {
	displaySignalMessage("starting signaling...");
	rtcPeerConn = new webkitRTCPeerConnection(configuration, {optional: []});
	dataChannel = rtcPeerConn.createDataChannel('positionMessages', dataChannelOptions);
	console.log('dataChannel created', dataChannel);

	dataChannel.onerror = logError;
	dataChannel.onmessage = receiveDataChannelMessage;
	dataChannel.onopen = dataChannelStateChanged;
	rtcPeerConn.ondatachannel = receiveDataChannel;

	// send any ice candidates to the other peer
	rtcPeerConn.onicecandidate = function (evt) {
		if (evt.candidate && rtcPeerConn.remoteDescription.type.length > 0) {
			console.log('Created ICE candidate, now sending: ', evt.candidate);
			io.emit('signal',{"type":"ice candidate", "message": JSON.stringify({ 'candidate': evt.candidate }), "room":SIGNAL_ROOM});
		}
		displaySignalMessage("completed that ice candidate...");
	};

	// let the 'negotiationneeded' event trigger offer generation
	rtcPeerConn.onnegotiationneeded = function () {
		displaySignalMessage("On negotiation called");
		if (rtcPeerConn.remoteDescription.type.length === 0) rtcPeerConn.createOffer(sendLocalDesc, logError);
	}
}

function sendLocalDesc(desc) {
	rtcPeerConn.setLocalDescription(desc, function () {
		console.log('Sending local description: ', rtcPeerConn.localDescription);
		displaySignalMessage("sending local description");
		io.emit('signal',{"type":"SDP", "message": JSON.stringify({ 'sdp': rtcPeerConn.localDescription }), "room":SIGNAL_ROOM});
	}, logError);
}

//Data Channel Specific methods
function dataChannelStateChanged() {
	if (dataChannel.readyState === 'open') {
		displaySignalMessage("Data Channel open");
		dataChannel.onmessage = receiveDataChannelMessage;
	}
}

function receiveDataChannel(event) {
	displaySignalMessage("Receiving a data channel");
	console.log('event in receiveDataChannel', event)
	dataChannel = event.channel;
	// dataChannel.onmessage = receiveDataChannelMessage;
}

function receiveDataChannelMessage(event) {
	position = JSON.parse(event.data);
	displayMessage('Height: ' + position.position[1], 'Distance: ' + position.position[0]);
}

//Logging/Display Methods
function logError(error) {
	displaySignalMessage(error.name + ': ' + error.message);
}

function displayMessage(message1, message2) {
	heightArea.innerHTML = message1;
	distArea.innerHTML = message2;
}

function displaySignalMessage(message) {
	// signalingArea.innerHTML = signalingArea.innerHTML + "<br/>" + message;
}
