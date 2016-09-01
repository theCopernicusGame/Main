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

function setUser() {
  user.player = chooseUser()[0];
  user.myTurn = chooseUser()[1];
  user.pointFlag = true;
  user.trackFlag = false;
  user.points = 0;
  user.otherPoints = 0;
  user.spaceBarFlag = true;
  user.changeGravityValue = -1.6; //Moon gravity times multiplier for physijs Y coordinate
  user.changeGravityFlag = false;
  user.setMass = 1;
  user.checkMatches = 0;
  user.turnNumber = 1;
  user.usedSpaceBar = false;
}

setUser();

if (singleplayer === true) $('#pointsDivOnePlayer').css('opacity', '1' );

if (user.player === "user_2") displaySignalMessage("You've joined Player 1!");

function endTurnAndUpdate(points) {
  user.changeGravityFlag = false;
  turnEnded = true;
  user.points += points;
  user.pointFlag = false;
  t = parseFloat((performance.now() - t)/1000).toFixed(3);
  graphMotion();
  if (singleplayer === true) $('#p1OnlyPoints').text(user.points);
  if (user.player === "user_1") $('#p1Points').text(user.points);
  else $('#p2Points').text(user.points);
  if (singleplayer === false) dataChannel.send(JSON.stringify({ 'points': points }));
  setTimeout(function() {
    moved = false;
    if (singleplayer === false) {
      // DAVID, THIS MOVED IS NOT SENDING, SO MYTURN IS SWITCHING AND IT IMMEDIATELY COUNTS FIRST COLLISION (BECAUSE MOVED IS STILL TRUE)
      dataChannel.send(JSON.stringify({ 'moved': false }));
      dataChannel.send(JSON.stringify({ 'turn': user.myTurn }));
      user.myTurn = false;
      $('#throwBall').text('Please wait for other player to throw!').animate({ opacity: 1 })
    } else user.spaceBarFlag = true;
    user.pointFlag = true;
    scene.remove(ball);
    turnEnded = false;
    if (user.points > 5) endGame(user.player, user.points);
    addBall();
    if (singleplayer === true) user.checkMatches = 0;
  }, 2000)
}

function updateAndStartTurn() {
  user.myTurn = received.turn;
  user.checkMatches = 0;
  if (user.myTurn === true) $('#throwBall').animate({ opacity: 0 });
  scene.remove(ball2);
  console.log('Adding ball before moved is changed to false?: ', moved)
  addBall();
  user.pointFlag = true;
  user.spaceBarFlag = true;
   $('#start-tracking').attr("disabled", false);
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

function endGame(player, points){
  $("#end").text("Game over! " + player + " got to " + points + " points!  But really, everyone wins when you're learning.");
  $('#line-graph').fadeOut(500);
  $('#end').animate({ opacity: 1 });
}

function addScene() {
  $('#gamescript').append( `<script type=` + `"text/javascript"` + ` src=` + `"/scene/scene.js"` + `></script>` );
}

setTimeout(addScene, 2000);
