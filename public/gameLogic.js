'use strict';

var user = {};
var turnEnded = false;
var moved = false;


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
  user.trackFlag = false;
  user.points = 0;
  user.otherPoints = 0;
  user.spaceBarFlag = false;
  user.changeGravityValue = -1.6; //Moon gravity times multiplier for physijs Y coordinate
  user.checkMatches = 0;
  user.canIThrow = chooseUser()[1];
}

setUser();

if (singleplayer === true) $('#pointsDivOnePlayer').animate({ opacity: 1 });
if (singleplayer === true){
    $('#calling').animate({ opacity: 0 });
    muteButton.disabled = true;
    unmuteButton.disabled = true;
}

if (user.player === "user_2") displaySignalMessage("You've joined Player 1!");

function endTurnAndUpdate(points) {
  turnEnded = true;
  user.spaceBarFlag = false;
  user.trackFlag = false;
  user.checkMatches = 0;

  graphMotion();
  updateMyPoints(points);

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

function updateAndStartTurn() {
  turnEnded = false;
  user.trackFlag = false;
  user.canIThrow = true;
  user.myTurn = received.turn;
  transitionTracking();

  scene.remove(ball2);
  addBall();
}

function updateMyPoints(points) {
  user.points += points;
  if (singleplayer === true) $('#p1OnlyPoints').text(user.points);
  else dataChannel.send(JSON.stringify({ 'points': points }));
  if (user.player === "user_1") $('#p1Points').text(user.points);
  else $('#p2Points').text(user.points);
}

function updateOtherPoints() {
  user.otherPoints += received.points;
  if (user.player === "user_1") $('#p2Points').text(user.otherPoints);
  else $('#p1Points').text(user.otherPoints);
}

function checkBadThrow() {
  if (ball.position.y < -1) {
    endTurnAndUpdate(0);
  } else if ((performance.now() - t)/1000 > 15) {
    endTurnAndUpdate(0);
  }
}

function endGame(player, points){
  $("#end").text("Game over! " + player + " got to " + points + " points! Restarting your game shortly.");
  $('#line-graph').animate({ opacity: 0 }, 500);
  $('#end').animate({ opacity: 1 });
  setTimeout(function(){
    restartGame();
  }, 3000);
}

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
  // make sure this works
  updateMyPoints(user.points);
  $('#end').animate({ opacity: 0 }, 500);
}

// ensure player cannot throw ball with spacebar when it's not their turn
$(document).keyup(function(event) {
  if (event.keyCode === 32 && user.myTurn === true && user.canIThrow === true) {
    var velocityNum = Number($('#velocity-num').text());
    userVelocity = velocityNum;
    user.canIThrow = false;
    user.spaceBarFlag = true;
    $('#velocity').fadeOut(700);
    setTimeout(function() { $('#velocity-num').text(0) }, 700);
  }
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

// when user hits target call this and -send through dataChannel
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


if (typeof exports !== 'undefined')
{
  module.exports = {chooseUser, setUser};
}
