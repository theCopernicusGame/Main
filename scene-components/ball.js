'use strict';

var textureLoader = new THREE.TextureLoader();
var ballGeometry = new THREE.SphereGeometry(.3, 28.8, 14.4), 
handleCollision = function( collided_with, linearVelocity, angularVelocity ) {
        switch ( ++this.collisions ) {
          case 1:
          console.log('collided_with', collided_with.position); 
          this.material.color.setHex(0xcc8855);
            break;
            default: 
            console.log('capturing addtnl collisions', collided_with.position, 'collisions', this.collisions); 
  
        }
      }
// var ballGeometry = new THREE.CubeGeometry( 1, 1, 1, 2, 2, 2 );
// var ballGeometry = new THREE.IcosahedronGeometry( 40, 1 );
var moonNormal  = textureLoader.load('assets/finalMoonPics/normal.jpg');
var moonMap = textureLoader.load('assets/finalMoonPics/moonPic.jpg');
var ballTexture = new THREE.MeshPhongMaterial( { map: moonMap, normalMap: moonNormal} );//TEST RED BALL FOR LOAD TIME
var ballTexture2 = new THREE.MeshPhongMaterial( { color: 0xFF0000} );



// var ball = new Physijs.SphereMesh(ballGeometry, ballTexture, undefined, { restitution: Math.random() * 1.5 } );
var ball = new Physijs.SphereMesh(ballGeometry, ballTexture, undefined, .9 );
ball.castShadow = true;
ball.position.z = -2;
ball.position.x = 2;
ball.position.y = 4;
ball.collisions = 0; 
ball.__dirtyPosition = true;
ball.receiveShadow = true;
ball.addEventListener( 'collision', handleCollision );



