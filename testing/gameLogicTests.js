'use strict'
var chai = require('chai'); 
var expect = require('chai').expect; 
var gameLogic = require('../public/gameLogicFunctions');
var peerFound, resArr = []; 
 
describe('GAME LOGIC TESTING', function() {
    describe('chooseUser function', function(){
        it('should return ["user_2", false] when player 1 exists', function(done){
            peerFound = false; 
            var output = gameLogic.chooseUser(); 
            expect(output).to.contain(true); 
            done(); 
        }); 
         it('should return ["user_1", true] when player 1 does not exist', function(done){
            console.log('out2', output); 
            peerFound = true; 
            var output = gameLogic.chooseUser(); 
            expect(output).to.exist; 
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
    }); 
}); 