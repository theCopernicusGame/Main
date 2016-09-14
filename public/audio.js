$(function() {
var unmuteButton = document.querySelector('#unmuteButton');
var muteButton = document.querySelector('#muteButton');
var audio = document.querySelector('#audio');

muteButton.disabled = true;
unmuteButton.onclick = unmute;
muteButton.onclick = mute;

//Start AUDIO
function unmute(){
  audioTracks[0].enabled = true;
  muteButton.disabled = false;
  dataChannel.send(JSON.stringify({'unmuted': true}));
}

//STOP AUDIO
function mute() {
  audioTracks[0].enabled = false;
  dataChannel.send(JSON.stringify({'unmuted': false}));
};

});
