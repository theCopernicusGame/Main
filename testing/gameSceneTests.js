'use strict'
var chai = require('chai'); 
var expect = require('chai').expect; 
var sceneObjects = require('../scene/sceneObjects');
var peerFound, resArr = []; 
 

  
  describe('ball object', function(){
    it('should exist', function(done){
        var output = sceneObjects.ballBuilder(); 
        expect(output).to.exist; 
        done(); 
    });
    it('should contain geometry property', function(done){
        var output = sceneObjects.ballBuilder(); 
        expect(output).to.have.any.keys('geometry'); 
        done(); 
    });
    it('should contain position property', function(done){
        var output = sceneObjects.ballBuilder(); 
        resArr = []; 
        for (var x in output){
          if (x === 'position') resArr.push(output[x]); 
        }
        expect(output).to.have.any.keys('position'); 
        done(); 
    });
     it('position property should be set to {x: 0, y: 0, z: 0}', function(done){
        var output = sceneObjects.ballBuilder(); 
        var testObj = {}; 
        for (var x in output){
          if (x === 'position'){
            for (var inner in output[x]){
                if (inner === 'x') testObj[inner] = output[x][inner];
                else if (inner === 'y') testObj[inner] = output[x][inner];
                else if (inner === 'z') testObj[inner] = output[x][inner];
            }   
          }
        }
        expect([testObj]).to.deep.include.members([{'x': 0, 'y': 0, 'z': 0}]); 
        done(); 
    });
    it('should contain materials property', function(done){
        var output = sceneObjects.ballBuilder();
        expect(output).to.have.any.keys('material'); 
        done(); 
    }); 
    it('material should be MeshPhong', function(done){
        var output = sceneObjects.ballBuilder(); 
        var testObj = {}; 
        for (var x in output){
          if (x === 'material'){
            for (var inner in output[x]){
                if (inner === 'type') testObj[inner] = output[x][inner];
            }   
          }
        }
        expect([testObj]).to.deep.include.members([{'type':'MeshPhongMaterial'}]); 
        done(); 
    }); 
       it('should have an initial rotation of {x: 0, y: 0, z: 0}', function(done){
         var output = sceneObjects.ballBuilder(); 
        var testObj = {}; 
        for (var x in output){
          if (x === 'rotation'){
            for (var inner in output[x]){
                if (inner === 'x') testObj[inner] = output[x][inner];
                else if (inner === 'y') testObj[inner] = output[x][inner];
                else if (inner === 'z') testObj[inner] = output[x][inner];
            }   
          }
        }
        expect([testObj]).to.deep.include.members([{'x': 0, 'y': 0, 'z': 0}]); 
        done(); 
    });  
       it('should have a collisions property set to 0', function(done){
         var output = sceneObjects.ballBuilder(); 
        var testObj = {}; 
        for (var x in output){
          if (x === 'collisions') testObj[x] = output[x];  
        }
        expect([testObj]).to.deep.include.members([{'collisions': 0}]); 
        done(); 
    });  
}); 


