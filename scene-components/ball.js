'use strict';

var textureLoader = new THREE.TextureLoader();
var ballGeometry = new THREE.SphereGeometry(.3, 28.8, 14.4),
handleCollision = function( collided_with, linearVelocity, angularVelocity ) {
        switch ( ++this.collisions ) {

          case 4:
            //console.log('HIT GROUND!', collided_with.position, 'ball pos', this.position, 'target pos', target.position);
            this.material.color.setHex(0xcc8855);
            if ( user.pointFlag === true && ((this.position.x - target.position.x) > -2) && ((this.position.x - target.position.x) < 2)  && ((this.position.z - target.position.z) < 2)  && ((this.position.z - target.position.z) < 2) ){
              user.points += 2;
              user.pointFlag = false;
              user.trackFlag = false;
              //console.log("Player got 2 points!", user);
              $('#p1Points').text(user.points);
              break; 
            }
            else if ( user.pointFlag === true && ((this.position.x - target.position.x) > -3.5) && ((this.position.x - target.position.x) < 3.5)  && ((this.position.z - target.position.z) < 3.5)  && ((this.position.z - target.position.z) < 3.5) ){
              user.points += 1;
              user.trackFlag = false; 
              user.pointFlag = false;
              //console.log("Player got 1 point!", user);
              break; 
            }
             else {
              user.trackFlag = false;
              user.pointFlag = false; 
             // console.log('Tough break, no points!!', target.position);
              break; 
            }
            default: 
            //console.log('collisions', this.collisions); 
        }
    };

// MOVE COLLISION/GAME LOGIC FROM HERE TO CORRECT FILE

var moonNormal  = textureLoader.load('assets/finalMoonPics/normal.jpg');
var moonMap = textureLoader.load('assets/finalMoonPics/moonPic.jpg');
var ballTexture = new THREE.MeshPhongMaterial( { map: moonMap, normalMap: moonNormal} );//TEST RED BALL FOR LOAD TIME
var ballTexture2 = new THREE.MeshPhongMaterial( { color: 0xFF0000} );


var ball = new Physijs.SphereMesh(ballGeometry, ballTexture, .3, .9 );
ball.castShadow = true;
ball.collisions = 0;
ball.__dirtyPosition = true;
ball.receiveShadow = true;
ball.addEventListener( 'collision', handleCollision );

var ball2 = new Physijs.SphereMesh(ballGeometry, ballTexture, .3, .9 );
