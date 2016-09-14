'use strict'
var chai = require('chai'); 
var expect = require('chai').expect; 
var gameLogic = require('../public/gameLogicFunctions');
var peerFound, resArr = []; 
 
describe('GAME LOGIC TESTING', function() {
  
  describe('chooseUser function', function(){
    it('should assign player as "user_2" if user_1 exists', function(done){
        peerFound = true; 
        var output = gameLogic.chooseUser(peerFound); 
        expect(output).to.contain('user_2'); 
        done(); 
    }); 
     it('should assign player as "user_1" if user_1 does not exist', function(done){ 
        peerFound = false; 
        var output = gameLogic.chooseUser(peerFound); 
        expect(output).to.contain('user_1'); 
        done(); 
    });
     it('should assign myTurn to true if player is user_1', function(done){ 
        peerFound = false; 
        var output = gameLogic.chooseUser(peerFound); 
        expect(output).to.contain(true); 
        done(); 
    });
     it('should assign myTurn to false if player is user_2', function(done){ 
        peerFound = true; 
        var output = gameLogic.chooseUser(peerFound); 
        expect(output).to.contain(false); 
        done(); 
    });
  }); 
  describe('setUser function', function(){
    it('should invoke chooseUser', function(done){
        peerFound = false; 
        var output = gameLogic.setUser(); 
        expect(output).to.exist;  
        done(); 
    });
    it('should set player points to zero', function(done){
        var output = gameLogic.updateAndStartTurn();
        resArr = []; 
        for (var x in output){
          if (x === 'points') resArr.push({[x]: output[x]}); 
        }
        expect(resArr).to.deep.include.members([{ 'points': 0 }]);
        done();  
    }); 
    it('should set other players points to zero', function(done){
        var output = gameLogic.updateAndStartTurn();
        resArr = []; 
        for (var x in output){
          if (x === 'otherPoints') resArr.push({[x]: output[x]}); 
        }
        expect(resArr).to.deep.include.members([{ 'otherPoints': 0 }]);
        done();  
    }); 
  });  
  describe('User object', function(){
    it('should contain myTurn property', function(done){
        peerFound = false; 
        var output = gameLogic.setUser();
        for (var x in output){
            resArr.push(x); 
        } 
        expect(resArr).to.contain('myTurn');
        done(); 
    });
    it('should contain trackFlag property', function(done){
        peerFound = false; 
        var output = gameLogic.setUser();
        for (var x in output){
            resArr.push(x); 
        } 
        expect(resArr).to.contain('trackFlag');
        done(); 
    });
    it('should contain points property', function(done){
         var output = gameLogic.setUser();
        for (var x in output){
            resArr.push(x); 
        } 
        expect(resArr).to.contain('points');
        done(); 
    });
      it('should contain trackFlag property', function(done){
         var output = gameLogic.setUser();
        for (var x in output){
            resArr.push(x); 
        } 
        expect(resArr).to.contain('trackFlag');
        done(); 
    });
        it('should contain canIThrow property', function(done){
         var output = gameLogic.setUser();
        for (var x in output){
            resArr.push(x); 
        } 
        expect(resArr).to.contain('canIThrow');
        done(); 
    });
  });
  describe('endTurnAndUpdate Functon', function(){
    it('should flip turnEnded flag to true', function(done){
        var output = gameLogic.endTurnAndUpdate(2, true);
        resArr = []; 
        for (var x in output){
          if (x === 'turnEnded') resArr.push({[x]: output[x]}); 
        }
        expect(resArr).to.deep.include.members([{ 'turnEnded': true }]);
        done();  
    }); 
      it('should reset chekMatches to zero', function(done){
        var output = gameLogic.endTurnAndUpdate(2, true);
        resArr = []; 
        for (var x in output){
          if (x === 'checkMatches') resArr.push({[x]: output[x]}); 
        }
        expect(resArr).to.deep.include.members([{ 'checkMatches': 0 }]);
        done();  
    }); 
        it('should increment points by points just earned', function(done){
        var output = gameLogic.endTurnAndUpdate(2, true);
        resArr = []; 
        for (var x in output){
          if (x === 'points') resArr.push({[x]: output[x]}); 
        }
        expect(resArr).to.deep.include.members([{ 'points': 2 }]);
        done();  
    }); 
  });
  describe('updateAndStartTurn Functon', function(){
    it('should flip turnEnded flag to false', function(done){
        var output = gameLogic.updateAndStartTurn();
        resArr = []; 
        for (var x in output){
          if (x === 'turnEnded') resArr.push({[x]: output[x]}); 
        }
        expect(resArr).to.deep.include.members([{ 'turnEnded': false }]);
        done();  
    }); 
    it('should flip trackFlag to false', function(done){
        var output = gameLogic.updateAndStartTurn();
        resArr = []; 
        for (var x in output){
          if (x === 'trackFlag') resArr.push({[x]: output[x]}); 
        }
        expect(resArr).to.deep.include.members([{ 'trackFlag': false }]);
        done();  
    }); 
      it('should flip canIThrow flag to true', function(done){
        var output = gameLogic.updateAndStartTurn();
        resArr = []; 
        for (var x in output){
          if (x === 'canIThrow') resArr.push({[x]: output[x]}); 
        }
        expect(resArr).to.deep.include.members([{ 'canIThrow': true }]);
        done();  
    }); 
  });
  describe('restartGame Functon', function(){
    it('should flip canIThrow flag to true', function(done){
        var output = gameLogic.restartGame(true);
        resArr = []; 
        for (var x in output){
          if (x === 'canIThrow') resArr.push({[x]: output[x]}); 
        }
        expect(resArr).to.deep.include.members([{ 'canIThrow': true }]);
        done();  
    }); 
    it('should flip turnEnded flag to false', function(done){
        var output = gameLogic.restartGame(true);
        resArr = []; 
        for (var x in output){
          if (x === 'turnEnded') resArr.push({[x]: output[x]}); 
        }
        expect(resArr).to.deep.include.members([{ 'turnEnded': false }]);
        done();  
    });
      it('new game should start with winning player throwing the ball', function(done){
        var output = gameLogic.restartGame(true);
        resArr = []; 
        for (var x in output){
          if (x === 'canIThrow') resArr.push({[x]: output[x]}); 
        }
        expect(resArr).to.deep.include.members([{ 'canIThrow': true }]);
        done();  
    }); 
      it('new game should start with losing player not throwing the ball', function(done){
        var output = gameLogic.restartGame(false);
        resArr = []; 
        for (var x in output){
          if (x === 'turnEnded') resArr.push({[x]: output[x]}); 
        }
        expect(resArr).to.deep.include.members([{ 'turnEnded': false }]);
        done();  
      });  
  }); 
  describe('randomizeAndDisplayGravity Functon', function(){
    it('should update the gravity', function(done){
        var output = gameLogic.restartGame(true);
        resArr = []; 
        for (var x in output){
          if (x === 'changeGravityValue') resArr.push(x); 
        } 
        expect(output).to.have.any.keys('changeGravityValue');
        done();   
      }); 
    it('new gravity should be below zero', function(done){
        var output = gameLogic.restartGame(true);
        resArr = []; 
        for (var x in output){
          if (x === 'changeGravityValue') resArr.push(output[x]); 
        } 
        expect(resArr[0]).to.be.below(0); 
        done();   
      }); 
    it('new gravity should be above -10', function(done){
        var output = gameLogic.restartGame(true);
        resArr = []; 
        for (var x in output){
          if (x === 'changeGravityValue') resArr.push(output[x]); 
        } 
        expect(resArr[0]).to.be.above(-10); 
        done();   
      }); 
  }); 
}); 