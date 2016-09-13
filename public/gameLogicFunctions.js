'use strict'; 

var peerFound; 

function chooseUser() {
  if (peerFound === true) {
    return ["user_2", false];
  } else {
    return ["user_1", true];
  }
}

var user = {}, resArr = []; 

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




if (typeof exports !== 'undefined')
{
  module.exports = {chooseUser, setUser}; 
}