'use strict';

// make collision logic more or less specific? need more on target radius

var textureLoader = new THREE.TextureLoader();
var ballGeometry = new THREE.SphereGeometry(.3, 28.8, 14.4);
var handleCollision = function( collided_with, linearVelocity, angularVelocity ) {
  switch ( ++this.collisions ) {
    case 2:
      if ( user.pointFlag === true && ((this.position.x - target.position.x) > -2) && ((this.position.x - target.position.x) < 2)  && ((this.position.z - target.position.z) < 2)  && ((this.position.z - target.position.z) < 2) ){
        endTurnAndUpdate(2);
        randomizeAndDisplayGravity();
      }
      //CHANGED FOR TESTING PURPOSES - POINT ASSIGNMENTS TBD
      else if ( user.pointFlag === true && ((this.position.x - target.position.x) > -4.5) && ((this.position.x - target.position.x) < 4.5)  && ((this.position.z - target.position.z) < 4.5)  && ((this.position.z - target.position.z) < 4.5) ){
        endTurnAndUpdate(1);
      }
      else {
        endTurnAndUpdate(0);
      }
    }
  };

var moonNormal  = textureLoader.load('assets/finalMoonPics/normal.jpg');
var moonMap = textureLoader.load('assets/finalMoonPics/moonPic.jpg');
var ballTexture = new THREE.MeshPhongMaterial({ map: moonMap, normalMap: moonNormal });//TEST RED BALL FOR LOAD TIME
var ballTexture2 = new THREE.MeshPhongMaterial( { color: 0xFF0000} );


var ball = new Physijs.SphereMesh(ballGeometry, ballTexture, 1, .9 );
ball.castShadow = true;
ball.collisions = 0;
ball.__dirtyPosition = true;
ball.__dirtyRotation = true;
ball.receiveShadow = true;
ball.addEventListener( 'collision', handleCollision );
ball.material.color.setHex(0xcc8855);

var ball2 = new Physijs.SphereMesh(ballGeometry, ballTexture, 1, .9 );
ball2.castShadow = true;
ball2.collisions = 0;
ball2.__dirtyPosition = true;
ball2.receiveShadow = true;
ball2.material.color.setHex(0xcc8855);
