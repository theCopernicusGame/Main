//ball
var THREE = require('../lib/three.min.js'); 

function ballBuilder(){
  var ballGeometry = new THREE.SphereGeometry(.3, 28.8, 14.4);
  var handleCollision = function( collided_with, linearVelocity, angularVelocity ) {
    if (this.position.x < 4.80 && moved === true) {
      this.collisions++;
      switch ( this.collisions ) {
        case 1:
        if ( ((this.position.x - target.position.x) > -.75) && ((this.position.x - target.position.x) < .75)  && ((this.position.z - target.position.z) < .75)  && ((this.position.z - target.position.z) < .75) ) {
          randomizeAndDisplayGravity();
          endTurnAndUpdate(2);
        }
        else if ( ((this.position.x - target.position.x) > -1.2) && ((this.position.x - target.position.x) < 1.2)  && ((this.position.z - target.position.z) < 1.2)  && ((this.position.z - target.position.z) < 1.2) ) {
          randomizeAndDisplayGravity();
          endTurnAndUpdate(1);
        }
        else {
          endTurnAndUpdate(0);
        }
      }
    }
  };
  var ballTexture = new THREE.MeshPhongMaterial({ color: 0x2BD3A7}); //TEST RED BALL FOR LOAD TIME
  //var ballTexture = new THREE.MeshPhongMaterial( { } );
  var ball = new THREE.Mesh(ballGeometry, ballTexture);
  ball.castShadow = true;
  ball.collisions = 0;
  ball.__dirtyPosition = true;
  ball.__dirtyRotation = true;
  ball.receiveShadow = true;
  ball.addEventListener( 'collision', handleCollision );
  return ball; 
}


function earthBuilder(){
  var textureLoader = new THREE.TextureLoader();
  var earthGeometry = new THREE.SphereGeometry(36, 28.8, 14.4);
  var earthMap  = textureLoader.load('/assets/planetPics/earthmap1k.jpg');
  var earthBump = textureLoader.load('/assets/planetPics/earthbump1k.jpg');
  var earthSpec = textureLoader.load('/assets/planetPics/earthspec1k.jpg');
  var earthTexture = new THREE.MeshPhongMaterial( { map: earthMap, bumpMap: earthBump, specularMap: earthSpec} );
  var earth = new THREE.Mesh(earthGeometry, earthTexture );

  earth.position.z = 80;
  earth.position.x = -300;
  earth.position.y = -10;
  earth.castShadow = true;
  return earth; 
}






if (typeof exports !== 'undefined')
{
  module.exports = {ballBuilder, earthBuilder}; 
}