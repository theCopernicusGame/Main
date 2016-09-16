'use strict';

//Ball is a physijs object so it can be impacted by gravity and collide with target/floor.  Collision
//functionality used to determine points (position of ball on contact with floor vs. position of target)
//Ball throws a shadow on the other objects in the scene, 2nd ball for other player's view.  Ball's position
//is passed through dataChannel and is used to determine ball2's position, which is seen by player2
var textureLoader = new THREE.TextureLoader();
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

// var moonNormal  = textureLoader.load('/assets/planetPics/normal.jpg');
var moonMap = textureLoader.load('/assets/planetPics/moonmap1k.jpg');
var moonBump = textureLoader.load('/assets/planetPics/moonbump1k.jpg');
var ballTexture = new THREE.MeshPhongMaterial({ color: 0x2BD3A7, map: moonMap }); //


var ball = new Physijs.SphereMesh(ballGeometry, ballTexture, 1, .9 );
ball.castShadow = true;
ball.collisions = 0;
ball.__dirtyPosition = true;
ball.__dirtyRotation = true;
ball.receiveShadow = true;
ball.addEventListener( 'collision', handleCollision );
//ball.material.color.setHex(0xcc8855);

var ball2 = new Physijs.SphereMesh(ballGeometry, ballTexture, 1, .9 );
ball2.castShadow = true;
ball2.collisions = 0;
ball2.__dirtyPosition = true;
ball2.receiveShadow = true;
//ball2.material.color.setHex(0xcc8855);
