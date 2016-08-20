'use strict';
// this should apply all game logic before rendering the scene

var user = {};

function chooseUser() {
  if (peerFound == true) {
    return ["user_2", false];
  } else {
    return ["user_1", true];
  }
}

user.player = chooseUser()[0];
user.myTurn = chooseUser()[1];
user.points = 0; 
user.pointFlag = true; 
user.trackFlag = true; 

function addScene() {
  $('#gamescript').append( `<script type=` + `"text/javascript"` + ` src=` + `"scene.js"` + `></script>` );
}

setTimeout(addScene, 2000);
