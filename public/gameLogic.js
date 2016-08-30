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
user.currentSetMass = 1;
user.otherPoints = 0;

user.spaceBarFlag = true;
user.changeGravityValue = 1.6 * -12.5; //Moon gravity times multiplier for physijs Y coordinate

user.changeGravityFlag = false;
user.setMass = 1;


if (user.player === "user_2") displaySignalMessage("You've joined Player 1!");

function endTurnAndUpdate(points) {
  user.changeGravityFlag = false;
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
    $('#bg').append('#throwBall');
    $('#throwBall').text('Please wait for other player to throw!').css('opacity', '1').fadeOut(1).delay(500).fadeIn(1500);
    user.pointFlag = true;
    scene.remove(ball);
    turnEnded = false;
    if (user.points > 5) endGame(user.player, user.points);
    addBall();
  }, 2000)
}

function updateAndStartTurn() {
  user.myTurn = received.turn;
  if (user.myTurn === true) $('#throwBall').fadeOut(500);
  scene.remove(ball2);
  addBall();
  user.pointFlag = true;
  user.spaceBarFlag = true;
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
  var end = $("<div id='end'></div>").text("Game over! " + player + " got to " + points + " points!  But really, everyone wins when you're learning.");
  console.log('end', end);
  $('#line-graph').fadeOut(500);
  $('body').prepend(end);
  $('#end').fadeOut(0).fadeIn(500);
}

function addScene() {
  $('#gamescript').append( `<script type=` + `"text/javascript"` + ` src=` + `"./scene/scene.js"` + `></script>` );
}

setTimeout(addScene, 2000);
