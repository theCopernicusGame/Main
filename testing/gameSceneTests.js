'use strict'
var chai = require('chai'); 
var expect = require('chai').expect; 
var sceneObjects = require('../scene/sceneObjects');
var peerFound, resArr = []; 
 

describe('TESTING OBJECTS IN SCENE', function(){
  
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
describe('earth object', function(){
  it('should exist', function(done){
      var output = sceneObjects.earthBuilder(); 
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
  it('position property should be set to {x: -300, y: -10, z: 80}', function(done){
      var output = sceneObjects.earthBuilder(); 
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
      expect([testObj]).to.deep.include.members([{'x': -300, 'y': -10, 'z': 80}]); 
      done(); 
  });
  it('should have parameters radius: 36, widthSegments: 28.8, heightSegments: 14.4', function(done){
    var output = sceneObjects.earthBuilder(); 
    var testObj = {}; 
    for (var x in output){
      if (x === 'geometry'){
        for (var y in output[x])
          if (y === 'parameters'){
            for (var inner in output[x][y]){
              if (inner === 'radius') testObj[inner] = output[x][y][inner];
              else if (inner === 'widthSegments') testObj[inner] = output[x][y][inner];
              else if (inner === 'heightSegments') testObj[inner] = output[x][y][inner];
          }
        }   
      }
    }
    expect([testObj]).to.deep.include.members([{'radius': 36, 'widthSegments': 28.8, 'heightSegments': 14.4}]);
    done(); 
  });
  it('should contain materials property', function(done){
    var output = sceneObjects.earthBuilder();
    expect(output).to.have.any.keys('material'); 
    done(); 
  });
}); 
describe('light object', function(){
  it('should exist', function(done){
      var output = sceneObjects.lightBuilder(); 
      expect(output).to.exist; 
      done(); 
  });
  it("should be type 'Spotlight'", function(done){
      var output = sceneObjects.lightBuilder();
      var testObj = {};  
      for (var x in output){
        if (x === 'type') testObj[x] = output[x];
      }
      expect([testObj]).to.deep.include.members([{'type': 'SpotLight'}]); 
      done(); 
  });
  it('should contain position property', function(done){
      var output = sceneObjects.lightBuilder(); 
      resArr = []; 
      for (var x in output){
        if (x === 'position') resArr.push(output[x]); 
      }
      expect(output).to.have.any.keys('position'); 
      done(); 
  });
  it('position property should be set to {x: -230, y: 75, z: 15}', function(done){
      var output = sceneObjects.lightBuilder(); 
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
      expect([testObj]).to.deep.include.members([{'x': 230, 'y': 75, 'z': 15}]); 
      done(); 
  });     
  it('should contain geometry property', function(done){
    var output = sceneObjects.lightBuilder(); 
    expect(output).to.have.any.keys('color'); 
    done(); 
  });
});
  describe('floor object', function(){
  it('should exist', function(done){
      var output = sceneObjects.floorBuilder(); 
      expect(output).to.exist; 
      done(); 
  });
   it("should be type 'Mesh'", function(done){
      var output = sceneObjects.floorBuilder();
      var testObj = {};  
      for (var x in output){
        if (x === 'type') testObj[x] = output[x];
      }
      expect([testObj]).to.deep.include.members([{'type': 'Mesh'}]); 
      done(); 
  });
   it("should be able to receive a shadow", function(done){
      var output = sceneObjects.floorBuilder();
      var testObj = {};  
      for (var x in output){
        if (x === 'receiveShadow') testObj[x] = output[x];
      }
      expect([testObj]).to.deep.include.members([{'receiveShadow': true}]); 
      done(); 
  });
    it("should not be able to cast a shadow", function(done){
      var output = sceneObjects.floorBuilder();
      var testObj = {};  
      for (var x in output){
        if (x === 'castShadow') testObj[x] = output[x];
      }
      expect([testObj]).to.deep.include.members([{'castShadow': false}]); 
      done(); 
  });
    it('should contain position property', function(done){
      var output = sceneObjects.floorBuilder(); 
      resArr = []; 
      for (var x in output){
        if (x === 'position') resArr.push(output[x]); 
      }
      expect(output).to.have.any.keys('position'); 
      done(); 
  });
  it('position property should be set to {x: 0, y: -0.5, z: 0}', function(done){
      var output = sceneObjects.floorBuilder(); 
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
      expect([testObj]).to.deep.include.members([{'x': 0, 'y': -0.5, 'z': 0}]); 
      done(); 
  });
    it("should be rotated so it's visible in the scene", function(done){
      var output = sceneObjects.floorBuilder(); 
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
      expect([testObj]).to.deep.include.members([{'x': 1.5707963267948966, 'y': 0, 'z': 0}]); 
      done(); 
  });      
}); 
}); 




