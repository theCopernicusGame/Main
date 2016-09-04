//'use strict';
// this should apply all game logic before rendering the scene

var user = {};
var turnEnded = false;
var moved = false;

>>>>>>> f59bbf12c1600f0784565b3c02d79cffdbc0324d
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
}

setUser();


if (singleplayer === true) $('#pointsDivOnePlayer').css('opacity', '1' );

if (user.player === "user_2") displaySignalMessage("You've joined Player 1!");

function endTurnAndUpdate(points) {
  turnEnded = true;
  user.spaceBarFlag = false;
  user.trackFlag = false;
  user.checkMatches = 0;

  graphMotion();

  turnEnded = true;
  user.points += points;
  user.pointFlag = false;
  t = parseFloat((performance.now() - t)/1000).toFixed(3);
  graphMotion();
  if (singleplayer === true) $('#p1OnlyPoints').text(user.points);
  if (user.player === "user_1") $('#p1Points').text(user.points);
  else $('#p2Points').text(user.points);

  if (singleplayer === false) {
    setTimeout(function() {
      var displayGravity = $('#current-gravity').html();
      dataChannel.send(JSON.stringify({ 'points': points, 'gravityToProcess': user.changeGravityValue, 'gravityToDisplay': displayGravity }));
    }, 500);
  }
  setTimeout(function() {
    moved = false;
    if (singleplayer === false) {
      dataChannel.send(JSON.stringify({ 'moved': moved }));
      dataChannel.send(JSON.stringify({ 'turn': user.myTurn }));
      user.myTurn = false;
      $('#throwBall').text('Please wait for other player to throw!').animate({ opacity: 1 })
    }
    user.spaceBarFlag = false;
    user.pointFlag = true;
    scene.remove(ball);
    turnEnded = false;
    if (user.points > 5) endGame(user.player, user.points);
  }, 2000);

}

function updateAndStartTurn() {
  turnEnded = false;
  user.trackFlag = false;
  user.myTurn = received.turn;

  if (user.myTurn === true) $('#throwBall').animate({ opacity: 0 });

  scene.remove(ball2);
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

<<<<<<< HEAD
function checkForeverFall() {
  if (ball.position.y < -1 && turnEnded === false) {
    endTurnAndUpdate(0);
=======
function checkBadThrow() {
  if (ball.position.y < -1) {
    endTurnAndUpdate(0);
  // } else if ((performance.now() - t)/1000 > 15) {
  //   endTurnAndUpdate(0);
  // }
>>>>>>> f59bbf12c1600f0784565b3c02d79cffdbc0324d
  }
}

function endGame(player, points){
  $("#end").text("Game over! " + player + " got to " + points + " points! Restarting your game shortly.");
  $('#line-graph').animate({ opacity: 0}, 500);
  $('#end').animate({ opacity: 1 });
  setTimeout(function(){
    restartGame();
  }, 3000);
}

<<<<<<< HEAD
function restartGame(points) {
  clearTimeout(user.turnTimer);
  user.newThrow = true;
  user.collisions = 0;
  user.changeGravityFlag = false;
  turnEnded = true;
  user.points = 0;
  user.pointFlag = false;
  if (singleplayer === true) $('#p1OnlyPoints').text(user.points);
  else {
    $('#p1Points').text(user.points);
    $('#p2Points').text(user.points);
  }
    setTimeout(function() {
      var displayGravity = $('#current-gravity').html();
      if (singleplayer === false) dataChannel.send(JSON.stringify({ 'points': points, 'gravityToProcess': user.changeGravityValue, 'gravityToDisplay': displayGravity }));
    }, 500);
    setTimeout(function() {
      moved = false;
      if (singleplayer === false) {
        dataChannel.send(JSON.stringify({ 'moved': moved }));
        dataChannel.send(JSON.stringify({ 'turn': user.myTurn }));
        user.myTurn = false;
        $('#throwBall').text('Please wait for other player to throw!').animate({ opacity: 1 })
      } else user.spaceBarFlag = true;
      user.pointFlag = true;
      scene.remove(ball);
      turnEnded = false;
      addBall();
      $('#end').animate({ opacity: 0 });
      if (singleplayer === true) user.checkMatches = 0;
    }, 1500);
}


function addScene() {
  $('#gamescript').append( `<script type=` + `"text/javascript"` + ` src=` + `"/scene/scene.js"` + `></script>` );
=======
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
   if (singleplayer === true) $('#p1OnlyPoints').text(user.points);
   else if (user.player === "user_1") $('#p1Points').text(user.points);
   else $('#p2Points').text(user.points);
   $('#end').animate({ opacity: 0 }, 500);
>>>>>>> f59bbf12c1600f0784565b3c02d79cffdbc0324d
}

setTimeout(addScene, 2000);

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
}

//call this to convert gravities above 0;
function convertGravity(num) {
  console.log('new gravity', num);
  var correctGravity = num;
  if (num > 2.3) {
    correctGravity = Math.round(num * -1.2);
  }
  user.changeGravityValue = correctGravity;
  user.changeGravityFlag = true;
}

function updateGravityDiv(newVal) {
  $('#current-gravity').html(newVal);
}


var count = 1;
$(document).keyup(function(event) {
  if (event.keyCode === 32) {
    var velocityDiv = $('#velocity');
    var velocityNum = Number($('#velocity-num').html());
    processVelocity(velocityNum)
    user.spaceBarFlag = true;

    count = 1;
    velocityDiv.fadeOut(700);
  }
}).keydown(function(event) {
  if (event.keyCode == 32) {
    var velocityP = $('#velocity-num');
    var velocityDiv = $('#velocity');
    velocityDiv.fadeIn(400);

    var velocityNum = count;
    count++;
      if (velocityNum <= 27) {
        velocityP.html(velocityNum);
      }
  }
});


function processVelocity(inputV) {
  var velocityToProcess = 30 - inputV;

  user.velocity = velocityToProcess;
}

$('#instructions').hide();
$('#gear').click(function(){
  $('#instructions').fadeToggle('medium');
});
