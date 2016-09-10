var callButton = document.querySelector('button#callButton');
var hangupButton = document.querySelector('button#hangupButton');
hangupButton.disabled = true;
var audio = document.querySelector('#audio');
callButton.onclick = unmute;
hangupButton.onclick = hangUp;

//Start AUDIO
function unmute(){
  console.log('UNMUTING AUDIO',audioTracks[0]);
  audioTracks[0].enabled = true;
  hangupButton.disabled = false;
}
//STOP AUDIO
function hangUp() {
  console.log('MUTING AUDIO',audioTracks[0]);
  audioTracks[0].enabled = false;
};