'use strict';

// make collision logic more or less specific? need more on target radius

var textureLoader = new THREE.TextureLoader();
var ballGeometry = new THREE.SphereGeometry(.3, 28.8, 14.4);
var handleCollision = function( collided_with, linearVelocity, angularVelocity ) {
  if (this.position.x < 4.85 && moved === true) {
    this.collisions++;
    console.log(this.collisions, this.position.y, this.position.x);
    switch ( this.collisions ) {
      case 1:
          if ( user.pointFlag === true && ((this.position.x - target.position.x) > -.75) && ((this.position.x - target.position.x) < .75)  && ((this.position.z - target.position.z) < .75)  && ((this.position.z - target.position.z) < .75) ){
            randomizeAndDisplayGravity();
            endTurnAndUpdate(2);
          }
          else if ( user.pointFlag === true && ((this.position.x - target.position.x) > -1.2) && ((this.position.x - target.position.x) < 1.2)  && ((this.position.z - target.position.z) < 1.2)  && ((this.position.z - target.position.z) < 1.2) ){
           randomizeAndDisplayGravity();
           endTurnAndUpdate(1);
         }
         else {
           randomizeAndDisplayGravity();
           endTurnAndUpdate(0);
         }
       }
     }


};

var moonNormal  = textureLoader.load('/assets/finalMoonPics/normal.jpg');
var moonMap = textureLoader.load('/assets/finalMoonPics/moonPic.jpg');
var ballTexture = new THREE.MeshPhongMaterial({ map: moonMap, normalMap: moonNormal }); //TEST RED BALL FOR LOAD TIME
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
