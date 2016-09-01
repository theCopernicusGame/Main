//'use strict';
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


//function setUser() {
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
  user.collisions = 0; 
  user.newThrow = true; 
  user.turnTimer; 
//}

//setUser();


if (singleplayer === true) $('#pointsDivOnePlayer').css('opacity', '1' );

if (user.player === "user_2") displaySignalMessage("You've joined Player 1!");

function endTurnAndUpdate(points) {
  console.log('singleplayer', singleplayer); 
  clearTimeout(user.turnTimer); 
  user.newThrow = true; 
  user.collisions = 0;            
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
    user.spaceBarFlag = true;
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
  $("#end").text("Game over! " + player + " got to " + points + " points! Restarting your game shortly.");
  $('#line-graph').animate({ opacity: 0}, 500);
  $('#end').animate({ opacity: 1 });
  setTimeout(function(){
    restartGame(); 
  }, 2500); 
}

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
}

setTimeout(addScene, 2000);

//when user hits target call this and -send through dataChannel.
function randomizeAndDisplayGravity() {
  console.log('random');
    //from -1.6 to 9.8
    var randomNum = Math.random() * 11.4 - 1.6;
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
  if (num > 0) {
    correctGravity = Math.round(num * -1.2);
  }
  user.changeGravityValue = correctGravity;
  user.changeGravityFlag = true;
}

function updateGravityDiv(newVal) {
  $('#current-gravity').html(newVal);
}

$('#instructions').hide(); 
$('#gear').click(function(){
  $('#instructions').fadeToggle('medium'); 
}); 
