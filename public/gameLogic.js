'use strict';

// initializes user object and some flags
var user = {};
var turnEnded = false;
var moved = false;
var userVelocity;

// chooses user based on rtcPeerConn process
function chooseUser() {
  if (peerFound === true) {
    return ["user_2", false];
  } else {
    return ["user_1", true];
  }
}

// sets user object
function setUser() {
  user.player = chooseUser()[0];
  user.myTurn = chooseUser()[1];
  user.trackFlag = false; // start/stop tracking software
  user.points = 0;
  user.otherPoints = 0;
  user.spaceBarFlag = false; // for weighted spacebar velocity
  user.changeGravityValue = -1.6; // moon gravity times multiplier for physijs Y coordinate
  user.checkMatches = 0;
  user.canIThrow = chooseUser()[1];
}

setUser();

// game messages based on multi/singleplayer
if (singleplayer === true) $('#pointsDivOnePlayer').animate({ opacity: 1 });
if (singleplayer === true){
    $('#calling').animate({ opacity: 0 });
    muteButton.disabled = true;
    unmuteButton.disabled = true;
}

if (user.player === "user_2") displaySignalMessage("You've joined Player 1!");

// executes on ball collision
// handles point updates, plotting, turn transition, and scene adjustment
function endTurnAndUpdate(points) {
  turnEnded = true;
  user.spaceBarFlag = false;
  user.trackFlag = false;
  user.checkMatches = 0;

  graphMotion();
  updateMyPoints(points);

  // add points and graph upon collision, but wait a bit to stop the ball and end turn
  setTimeout(function() {
    moved = false;
    turnEnded = false;

    if (singleplayer === false) {
      dataChannel.send(JSON.stringify({ 'moved': moved }));
      dataChannel.send(JSON.stringify({ 'turn': user.myTurn }));
      user.myTurn = false;
    } else {
      user.canIThrow = true;
      transitionTracking();
    }

    scene.remove(ball);
    addBall();
    if (user.points > 5) endGame(user.player, user.points);
  }, 2000);

}

// on the other end, this runs when 'turn' is received
// handles turn transition and scene adjustment
function updateAndStartTurn() {
  turnEnded = false;
  user.trackFlag = false;
  user.canIThrow = true;
  user.myTurn = received.turn;
  transitionTracking();

  scene.remove(ball2);
  addBall();
}

// updates local points, depending on player
// tells remote peer to update his points accordingly
function updateMyPoints(points) {
  user.points += points;
  if (singleplayer === true) $('#p1OnlyPoints').text(user.points);
  else dataChannel.send(JSON.stringify({ 'points': points }));
  if (user.player === "user_1") $('#p1Points').text(user.points);
  else $('#p2Points').text(user.points);
}

// upon receiving point update from remote peer, update your points
function updateOtherPoints() {
  user.otherPoints += received.points;
  if (user.player === "user_1") $('#p2Points').text(user.otherPoints);
  else $('#p1Points').text(user.otherPoints);
}

// checks for throw that takes too long or falls below y = -1
function checkBadThrow() {
  if (ball.position.y < -1) {
    endTurnAndUpdate(0);
  } else if ((performance.now() - t)/1000 > 15) {
    endTurnAndUpdate(0);
  }
}

// executes in endTurnAndUpdate if points >= 5
function endGame(player, points){
  $("#end").text("Game over! " + player + " got to " + points + " points! Restarting your game shortly.");
  $('#line-graph').animate({ opacity: 0 }, 500);
  $('#end').animate({ opacity: 1 });
  setTimeout(function(){
    restartGame();
  }, 3000);
}

// executes on disconnection or endGame
// resets turn, ball position and user objects
function restartGame() {
  turnEnded = false;
  moved = false;
  if (user.myTurn === true) {
    peerFound = false;
    scene.remove(ball);
    if (singleplayer === false) dataChannel.send(JSON.stringify({ 'restart': true }))
    setUser();
    addBall();
    peerFound = true;
  } else {
    scene.remove(ball2);
    setUser();
    addBall();
  }
  // TODO: was having some issues with line below
  updateMyPoints(user.points);
  $('#end').animate({ opacity: 0 }, 500);
}

// spacebar functionality and velocity increment div
// ensure player cannot throw ball with spacebar when it's not their turn
// once spacebar is lifted, pass that velocity (userVelocity) into determineVelocity function
$(document).keyup(function(event) {
  if (event.keyCode === 32 && user.myTurn === true && user.canIThrow === true) {
    var velocityNum = Number($('#velocity-num').text());
    userVelocity = velocityNum;
    user.canIThrow = false;
    user.spaceBarFlag = true;
    $('#velocity').fadeOut(700);
    setTimeout(function() { $('#velocity-num').text(0) }, 700);
  }
// on press, fade in velocity div
// increment velocityNum by .5
// TODO: what is the standard interval for detecting keydowns on hold?
}).keydown(function(event) {
  if (event.keyCode == 32 && user.myTurn === true && user.canIThrow === true) {
    $('#velocity').fadeIn(400);
    $('#start-tracking').animate({ opacity: 0 }).attr("disabled", true);
    var velocityNum = Number($('#velocity-num').text());
    velocityNum += .5;
    var showNum = parseFloat(velocityNum).toFixed(1);
    if (velocityNum <= 27) {
      $('#velocity-num').text(showNum);
    }
  }
});

// when user hits target, call this and send through dataChannel
// for this version, gravity will not exceed 4m/s2
function randomizeAndDisplayGravity() {
  // from -1.6 to -9.8
  var randomNum = -(Math.random() * (4.0 - 1.6) + 1.6).toFixed(3);

  updateGravityDiv(randomNum);
  user.changeGravityValue = randomNum;
  var displayGravity = $('#gravity-num').text();
  if (singleplayer === false) {
    dataChannel.send(JSON.stringify({ 'gravityToProcess': user.changeGravityValue, 'gravityToDisplay': displayGravity }));
  }
}

// waits til this loads to add the scene
function addScene() {
  $('#gamescript').append( `<script type=` + `"text/javascript"` + ` src=` + `"/scene/scene.js"` + `></script>` );
}

setTimeout(addScene, 2000);
