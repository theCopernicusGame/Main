

var peerFound; 

function chooseUser(userFound) {
  if (userFound === true) {
    return ["user_2", false];
  } else {
    return ["user_1", true];
  }
}

var user = {}, resArr = [], turnEnded, moved, peerFound, singleplayer;  

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
  return user;  
}


function endTurnAndUpdate(points, bool) {
  user.points = 0; 
  turnEnded = true;
  user.spaceBarFlag = false;
  user.trackFlag = false;
  user.checkMatches = 0;
  user.turnEnded = true;
  user.points += points;  
  if (bool === false) {
      user.myTurn = false;
  } else {
    user.canIThrow = true;
  }
  return user; 
}

function updateAndStartTurn() {
  user. turnEnded = false;
  user.trackFlag = false;
  user.canIThrow = true;
  return user; 
}

function restartGame(myTurn) {
  user.turnEnded = false;
  moved = false;
  if (myTurn === true) {
    user.canIThrow = true;
  } else {
    user.canIThrow = false;
  }
  return user; 
}

function randomizeAndDisplayGravity() {
  // from -1.6 to -9.8
  var randomNum = -(Math.random() * (4.0 - 1.6) + 1.6).toFixed(3);
  user.changeGravityValue = randomNum;
  return user; 
}



if (typeof exports !== 'undefined')
{
  module.exports = {chooseUser, setUser, endTurnAndUpdate, updateAndStartTurn, restartGame, randomizeAndDisplayGravity}; 
}