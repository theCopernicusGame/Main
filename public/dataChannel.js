// DIRECTIONS, from server

// signaling variables setup:
// iceServers connects to development server hosted by Google, negotiates NAT/firewalls
// iceServers (STUN or TURN) technically not required in dev environment
var configuration = {
  'iceServers': [{
    'url': 'stun:stun.l.google.com:19302'
  }]
};

// initializes rtcPeerConn variable for P2P connection object
// dataChannel for specific dataChannel object
var rtcPeerConn;
var singleplayer = false;
var isDemo = false;

//ADD offerOptions to createOffer for Audio
var offerOptions = {
  offerToReceiveAudio: 1,
  offerToReceiveVideo: 0,
  voiceActivityDetection: false
};
var remoteStream;
var localStream;
var audioTracks;
var dataChannelOptions = {
  reliable: false,
  ordered: false, //no guaranteed delivery, unreliable but faster
  maxRetransmitTime: 1000, //milliseconds
};

//the name of the room you entered
var keyIndex = window.location.href.indexOf('game/') + 5;
var SIGNAL_ROOM = window.location.href.split('').splice(keyIndex).join('');

if (SIGNAL_ROOM === "singleplayer") singleplayer = true;
if (SIGNAL_ROOM === "demo") isDemo = true;

if (isDemo === true) $("#calling").hide();

// P2P information needed for game logic
var peerFound = false;

// set up socket connection between client and server for signaling
io = io.connect();


//COLLECTING AUDIO FOR CHAT AND START SIGNALING
if (singleplayer === false && isDemo === false) {
  navigator.mediaDevices.getUserMedia({audio: true, video: false}).then(function(stream) {
    localStream = stream;
    audioTracks = localStream.getAudioTracks();
    // if MediaStream has reference to microphone
    if (audioTracks[0]) {
      audioTracks[0].enabled = false;
    }
    // emits event to server setting up unique room
    // DIRECTIONS, to server.js
    io.emit('ready', {"signal_room": SIGNAL_ROOM });
  });
} else if (singleplayer === false && isDemo === true) io.emit('ready', { "signal_room": SIGNAL_ROOM })

if (singleplayer === false) {
  displaySignalMessage('Waiting for other player...')
} else {
  $('#signalingArea').animate({ marginTop: '80%' });
}

// DIRECTIONS, on setting up unique room
// sends a first signaling message to anyone in room listening
if (singleplayer === false) io.emit('signal',{ "type": "user_here", "message": "Let's play the CopernicusGame!", "room": SIGNAL_ROOM });

io.on('signaling_message', function(data) {
  if (data.type === "user_here") {
    displaySignalMessage('Player 2 is joining...');
  }
  setTimeout(transitionGameMessages, 10000);
  peerFound = true;

  // set up the RTC Peer Connection object
  if (!rtcPeerConn || rtcPeerConn.signalingState === 'closed') {
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
    }
  }
});

function startSignaling() {
  rtcPeerConn = new webkitRTCPeerConnection(configuration, {optional: []});
  dataChannel = rtcPeerConn.createDataChannel('gameMessages', dataChannelOptions);

  if (isDemo === false) rtcPeerConn.addStream(localStream);

  // send any ice candidates to the other peer
  rtcPeerConn.onicecandidate = function (evt) {
    if (evt.candidate && rtcPeerConn.remoteDescription.type.length > 0) {
      io.emit('signal',{"type":"ice candidate", "message": JSON.stringify({ 'candidate': evt.candidate }), "room":SIGNAL_ROOM});
    };
  };

  // let the 'negotiationneeded' event trigger offer generation
  rtcPeerConn.onnegotiationneeded = function (event) {
    //offer is created here by player 1
    if (rtcPeerConn.remoteDescription.type.length === 0){
     rtcPeerConn.createOffer(sendLocalDesc, logError, offerOptions);
   }
  };

  // let these dataChannel events trigger dataChannel methods
  dataChannel.onerror = logError;
  dataChannel.onmessage = receiveDataChannelMessage;
  dataChannel.onopen = dataChannelStateChanged;
  dataChannel.onclose = restartConnection;
  rtcPeerConn.ondatachannel = receiveDataChannel;

  rtcPeerConn.onaddstream = function (evt) {
    audio.src = URL.createObjectURL(evt.stream);
  };

  rtcPeerConn.oniceconnectionstatechange = function() {
    if (rtcPeerConn.iceConnectionState == 'disconnected') {
      displaySignalMessage('Your friend has disconnected!');
      $('#throwBall').animate({ opacity: 0 });
      $('#signalingArea').animate({ marginTop: '2.48%' });
      peerFound = false;
      rtcPeerConn.close();
    }
  }
}

// sends local description
function sendLocalDesc(desc) {
  rtcPeerConn.setLocalDescription(desc, function () {
    io.emit('signal',{"type":"SDP", "message": JSON.stringify({ 'sdp': rtcPeerConn.localDescription }), "room":SIGNAL_ROOM});
  }, logError);

}

// sends remote description
function sendRemoteDesc(desc) {
  rtcPeerConn.setRemoteDescription(new RTCSessionDescription(desc), function () {
    // if we received an offer, we need to answer
    if (rtcPeerConn.remoteDescription.type == 'offer') {
      rtcPeerConn.createAnswer(sendLocalDesc, logError);
    }
  }, logError);
}

function restartConnection() {
  io.emit('signal',{ "type": "user_here", "message": "Let's play the CopernicusGame!", "room": SIGNAL_ROOM });
  setUser();
  if (ball2) scene.remove(ball2);
  addBall();
}

//Data Channel Specific methods
function dataChannelStateChanged() {
  if (dataChannel.readyState === 'open') {
    dataChannel.onmessage = receiveDataChannelMessage;
  }
}

function receiveDataChannel(event) {
  dataChannel = event.channel;
}

function receiveDataChannelMessage(event) {
  received = JSON.parse(event.data);
  if (received.hasOwnProperty('position')) {
      message = received;
      displayPosition('Height: ' + parseFloat(message.position[1] - .3).toFixed(3) + 'm', 'Distance: ' + parseFloat(7 + message.position[0]).toFixed(3) + 'm');
  } else if (received.hasOwnProperty('moved')) {
    moved = received.moved;
  } else if (received.hasOwnProperty('turn')) {
    updateAndStartTurn();
  } else if (received.hasOwnProperty('points')) {
    updateOtherPoints();
  } else if (received.hasOwnProperty('gravityToProcess')) {
    user.changeGravityValue = received.gravityToProcess;
    user.changeGravityFlag = true;
    updateGravityDiv(received.gravityToDisplay);
  } else if (received.hasOwnProperty('restart')) {
    restartGame();
  } else if (received.hasOwnProperty('unmuted')) {
    audioTracks[0].enabled = received.unmuted;
  }
}

//Logging/Display Methods
function logError(error) {
  console.log(error.name + ': ' + error.message);
}

function addGameLogic() {
  $('#spotlight').append( `<script id=` + `"gamescript"` + `type=` + `"text/javascript"` + ` src=` + `"/public/gameLogic.js"` + `></script>` );
}
setTimeout(addGameLogic, 2000);
