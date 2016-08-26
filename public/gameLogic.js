'use strict';
// this should apply all game logic before rendering the scene

var user = {};
var turnEnded = false;

function chooseUser() {
  if (peerFound === true) {
    return ["user_2", false];
  } else {
    return ["user_1", true];
  }
}

user.player = chooseUser()[0];
user.myTurn = chooseUser()[1];
user.pointFlag = true;
user.trackFlag = false;
user.points = 0;
user.otherPoints = 0;

if (user.player === "user_2") displaySignalMessage("You've joined Player 1!");

function endTurnAndUpdate(points) {
  turnEnded = true;
  user.points += points;
  user.pointFlag = false;
  t = parseFloat((performance.now() - t)/1000).toFixed(3);
  graphMotion();
  if (user.player === "user_1") $('#p1Points').text(user.points);
  else $('#p2Points').text(user.points);
  dataChannel.send(JSON.stringify({ 'points': points }));
  setTimeout(function() {
    moved = false;
    dataChannel.send(JSON.stringify({ 'moved': moved }));
    dataChannel.send(JSON.stringify({ 'turn': user.myTurn }));
    user.myTurn = false;
    user.pointFlag = true;
    scene.remove(ball);
    turnEnded = false;
    addBall();
  }, 2000)
}

function updateAndStartTurn() {
  user.myTurn = received.turn;
  scene.remove(ball2);
  addBall();
  user.pointFlag = true;
}

function updateOtherPoints() {
  user.otherPoints += received.points;
  if (user.player === "user_1") $('#p2Points').text(user.otherPoints);
  else $('#p1Points').text(user.otherPoints);
}

function checkForeverFall() {
  if (ball.position.y < -1 && turnEnded === false) {
    endTurnAndUpdate(0);
  }
}

function addScene() {
  $('#gamescript').append( `<script type=` + `"text/javascript"` + ` src=` + `"./scene/scene.js"` + `></script>` );
}

setTimeout(addScene, 2000);
