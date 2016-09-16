// signaling variables setup:
// iceServers connects to development server hosted by Google, negotiates NAT/firewalls
// not required in dev environment
var configuration = {
  'iceServers': [{
    'url': 'stun:stun.l.google.com:19302'
  }]
};

// initializes rtcPeerConn variable for P2P connection object
// dataChannel for specific dataChannel object
// initializes game-determining booleans
var rtcPeerConn;
var singleplayer = false;
var isDemo = false;
var peerFound = false;

// initalizes audio stream objects
// add offerOptions to createOffer for audio
// add dataChannel options for dataChannel object on rtcPeerConn
var remoteStream;
var localStream;
var audioTracks;
var offerOptions = {
  offerToReceiveAudio: 1,
  offerToReceiveVideo: 0,
  voiceActivityDetection: false
};
var dataChannelOptions = {
  reliable: false, // expediency over infrequent packet loss
  ordered: false, // ditto
  maxRetransmitTime: 1000, // milliseconds
};

// index that starts after 'game/' to target unique room string
// sets SIGNAL_ROOM equal to that string
var keyIndex = window.location.href.indexOf('game/') + 5;
var SIGNAL_ROOM = window.location.href.split('').splice(keyIndex).join('');

// singleplayer routes to 'game/singleplayer'
// demo environment
if (SIGNAL_ROOM === "singleplayer") singleplayer = true;
if (SIGNAL_ROOM === "demo") isDemo = true;

// let's not display the walkie talkie during our demo...
if (isDemo === true) $("#calling").hide();


// set up socket connection between client and server for signaling
io = io.connect();


// collecting local audio for chat and starting signaling to server
if (singleplayer === false && isDemo === false) {
  navigator.mediaDevices.getUserMedia({audio: true, video: false}).then(function(stream) {
    localStream = stream;
    audioTracks = localStream.getAudioTracks();
    // if MediaStream has reference to microphone
    if (audioTracks[0]) {
      audioTracks[0].enabled = false;
    }
    // emits event to server setting up unique room
    io.emit('ready', {"signal_room": SIGNAL_ROOM });
  });
} else if (singleplayer === false && isDemo === true) io.emit('ready', { "signal_room": SIGNAL_ROOM })

// messages to first player depending on multi/singleplayer
if (singleplayer === false) {
  displaySignalMessage('Waiting for other player...')
} else {
  $('#signalingArea').animate({ marginTop: '80%' });
}

// sends a first signaling message to anyone in room listening
if (singleplayer === false) io.emit('signal',{ "type": "user_here", "message": "Let's play the CopernicusGame!", "room": SIGNAL_ROOM });

// upon receiving signaling_message from server
// starts exchange of information between potential peers
io.on('signaling_message', function(data) {
  // when first player receives first message from second player
  if (data.type === "user_here") {
    displaySignalMessage('Player 2 is joining...');
  }
  setTimeout(transitionGameMessages, 10000);
  peerFound = true;

  // rtcPeerConn not set up, so set up
  if (!rtcPeerConn || rtcPeerConn.signalingState === 'closed') {
    startSignaling();
  }

  // if user isn't the first user to join the page, peerConnect obj is already set up, so simply respond with description
  if (data.type != "user_here") {
    var message = JSON.parse(data.message);
    if (message.sdp) {
      sendRemoteDesc(message.sdp);
    }
    // set ICE candidates for NAT transversal
    else {
      rtcPeerConn.addIceCandidate(new RTCIceCandidate(message.candidate));
    }
  }
});

// sets up rtcPeerConn, dataChannel, and stream objects
function startSignaling() {
  // set up P2P objects
  rtcPeerConn = new webkitRTCPeerConnection(configuration, {optional: []});
  dataChannel = rtcPeerConn.createDataChannel('gameMessages', dataChannelOptions);
  if (isDemo === false) rtcPeerConn.addStream(localStream);

  // send any ice candidates to the other peer
  rtcPeerConn.onicecandidate = function (evt) {
    // to ensure description has been set before ICE candidates are determined
    if (evt.candidate && rtcPeerConn.remoteDescription.type.length > 0) {
      // emit candidates to room
      io.emit('signal',{"type":"ice candidate", "message": JSON.stringify({ 'candidate': evt.candidate }), "room":SIGNAL_ROOM});
    };
  };

  // let the 'negotiationneeded' event trigger offer generation
  // triggers when new object is added to rtcPeerConn (dataChannel, addStream)
  // TODO: offer is created twice, bug not game-breaking but definitely annoying
  rtcPeerConn.onnegotiationneeded = function (event) {
    // offer is created here by player 1
    if (rtcPeerConn.remoteDescription.type.length === 0){
     rtcPeerConn.createOffer(sendLocalDesc, logError);
   }
  };

  // let these dataChannel events trigger dataChannel methods
  dataChannel.onerror = logError;
  dataChannel.onmessage = receiveDataChannelMessage;
  dataChannel.onopen = dataChannelStateChanged;
  dataChannel.onclose = restartConnection;
  rtcPeerConn.ondatachannel = receiveDataChannel;

  // set src for audio stream to getUserMedia()
  rtcPeerConn.onaddstream = function (evt) {
    audio.src = URL.createObjectURL(evt.stream);
  };

  // checks for disconnection, informs users, and closes rtcPeerConn before restart
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

// sends local description, logs error if unsuccessful
function sendLocalDesc(desc) {
  rtcPeerConn.setLocalDescription(desc, function () {
    io.emit('signal',{"type":"SDP", "message": JSON.stringify({ 'sdp': rtcPeerConn.localDescription }), "room":SIGNAL_ROOM});
  }, logError);

}

// sends remote description, logs error if unsuccessful
function sendRemoteDesc(desc) {
  rtcPeerConn.setRemoteDescription(new RTCSessionDescription(desc), function () {
    // if we received an offer, we need to answer
    if (rtcPeerConn.remoteDescription.type == 'offer') {
      rtcPeerConn.createAnswer(sendLocalDesc, logError);
    }
  }, logError);
}

// runs on closing of peerConn, simply restarts signaling process, and resets a few game objects
function restartConnection() {
  io.emit('signal',{ "type": "user_here", "message": "Let's play the CopernicusGame!", "room": SIGNAL_ROOM });
  setUser();
  if (ball2) scene.remove(ball2);
  addBall();
}

// runs every time dataChannel state changes (i.e. opening, closing, receiving data)
function dataChannelStateChanged() {
  if (dataChannel.readyState === 'open') {
    dataChannel.onmessage = receiveDataChannelMessage;
  }
}

// on initialization of dataChannel between peers, sets dataChannel variable
function receiveDataChannel(event) {
  dataChannel = event.channel;
}

// on receiving a message, respond appropriately
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

// log errors
function logError(error) {
  console.log(error.name + ': ' + error.message);
}

// to ensure dataChannel precedes scene rendering and game logic starting
function addGameLogic() {
  $('#spotlight').append( `<script id=` + `"gamescript"` + `type=` + `"text/javascript"` + ` src=` + `"/public/gameLogic.js"` + `></script>` );
}
setTimeout(addGameLogic, 2000);
