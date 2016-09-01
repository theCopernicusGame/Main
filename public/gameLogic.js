'use strict';

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
  user.trackFlag = false;
  user.points = 0;
  user.otherPoints = 0;
  user.spaceBarFlag = true;
  user.changeGravityValue = -1.6; //Moon gravity times multiplier for physijs Y coordinate
  user.setMass = 1;
}

setUser();

if (singleplayer === true) $('#pointsDivOnePlayer').animate({ opacity: 1 });

if (user.player === "user_2") displaySignalMessage("You've joined Player 1!");

function endTurnAndUpdate(points) {
  turnEnded = true;
  user.trackFlag = false;
  graphMotion();

  user.points += points;
  if (singleplayer === true) $('#p1OnlyPoints').text(user.points);
  else if (user.player === "user_1") $('#p1Points').text(user.points);
  else $('#p2Points').text(user.points);
  dataChannel.send(JSON.stringify({ 'points': points }));

  setTimeout(function() {
    moved = false;
    user.spaceBarFlag = true;

    if (singleplayer === false) {
      dataChannel.send(JSON.stringify({ 'moved': moved }));
      dataChannel.send(JSON.stringify({ 'turn': user.myTurn }));
      user.myTurn = false;
      $('#throwBall').text('Please wait for other player to throw!').animate({ opacity: 1 })
    }

    scene.remove(ball);
    addBall();
    if (user.points > 5) endGame(user.player, user.points);
  }, 2000)
}

function updateAndStartTurn() {
  turnEnded = false;
  user.spaceBarFlag = true;

  user.myTurn = received.turn;
  $('#throwBall').animate({ opacity: 0 });

  scene.remove(ball2);
  addBall();
  $('#start-tracking').attr("disabled", false);
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
  }, 2500);
}

function restartGame() {
  turnEnded = false;
  moved = false;
  if (user.myTurn === true) {
    peerFound = false;
    scene.remove(ball);
    dataChannel.send(JSON.stringify({ 'restart': true }))
    setUser();
    addBall();
    peerFound = true;
  } else {
    scene.remove(ball2);
    setUser();
    addBall();
  }
}

//when user hits target call this and -send through dataChannel.
function randomizeAndDisplayGravity() {
  //from -1.6 to 9.8
  var randomNum = Math.random() * 8.2 + 1.6;
  var result = "";
  randomNum = randomNum.toString().split('.');
  result += randomNum[0];
  result += '.';
  result += randomNum[1][0];

  //update the gravity div;
  updateGravityDiv(result);

  //return the converted gravity example: 9.8earth should be -12 in physijs;
  convertGravity(Number(result));

  var displayGravity = $('#current-gravity').html();
  if (singleplayer === false) {
    dataChannel.send(JSON.stringify({ 'gravityToProcess': user.changeGravityValue, 'gravityToDisplay': displayGravity }));
  }
}

//call this to convert gravities above 0;
function convertGravity(num) {
  var correctGravity = num;
  if (num > 2.3) {
    correctGravity = Math.round(num * -1.2);
  }
  user.changeGravityValue = correctGravity;
}

function updateGravityDiv(newVal) {
  $('#current-gravity').html(newVal);
}

// waits til this loads to add the scene
function addScene() {
  $('#gamescript').append( `<script type=` + `"text/javascript"` + ` src=` + `"/scene/scene.js"` + `></script>` );
}

setTimeout(addScene, 2000);
