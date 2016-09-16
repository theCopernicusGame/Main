//Onload functionality required to sync properly with pulling audio via navigator.mediaDevices.getUserMedia
$(function() {
    var unmuteButton = document.querySelector('#unmuteButton');
    var muteButton = document.querySelector('#muteButton');
    var audio = document.querySelector('#audio');

    muteButton.disabled = true;
    $('#unmuteButton').click(function(){
        unmute(); 
    }); 
    muteButton.onclick = mute;

    //Start AUDIO 
    //player clicks the green "Talk" button, then
    //audioTracks refs the localStream (audio captured by local mic), collects local audio - then we send a message to the 
    //other player to play their audio
    function unmute(){
      audioTracks[0].enabled = true;
      muteButton.disabled = false;
      dataChannel.send(JSON.stringify({'unmuted': true}));
    }

    //STOP AUDIO
    //player clicks the red "Mute" button, then
    // stop collecting local audio and send message to other player to shut off their audio
    function mute() {
      audioTracks[0].enabled = false;
      dataChannel.send(JSON.stringify({'unmuted': false}));
    };
}); 

