'use strict';

// make collision logic more or less specific? need more on target radius

var textureLoader = new THREE.TextureLoader();
var ballGeometry = new THREE.SphereGeometry(.3, 28.8, 14.4);
var handleCollision = function( collided_with, linearVelocity, angularVelocity ) {
  if (this.position.x < 4.85){
    if (this.position.y > -8 && this.position.y < 10){
      user.collisions++; 
      console.log('uColl', user.collisions); 
       
      switch ( ++this.collisions ) {

      case 1:
  //     console.log('PF', user.pointFlag, 'collisions', this.collisions, 'ball poss', this.position.x, this.position.z, 'target', target.position.x, target.position.z);
          if ( user.pointFlag === true && ((this.position.x - target.position.x) > -.75) && ((this.position.x - target.position.x) < .75)  && ((this.position.z - target.position.z) < .75)  && ((this.position.z - target.position.z) < .75) ){
            endTurnAndUpdate(2);
          }
          else if ( user.pointFlag === true && ((this.position.x - target.position.x) > -1.2) && ((this.position.x - target.position.x) < 1.2)  && ((this.position.z - target.position.z) < 1.2)  && ((this.position.z - target.position.z) < 1.2) ){
           endTurnAndUpdate(1);
         }
         else {
        //   console.log('collisions', this.collisions, user.pointFlag);
           endTurnAndUpdate(0);
         } 
      console.log('this.collisions', this.collisions, 'x pos', this.position.x, 'y pos', this.position.y); 
    }
  }
  }


};

  // if (singleplayer === true && user.turnNumber !== 1){
  //   switch ( ++this.collisions ) {
  //     case 1:
  //     console.log('PF', user.pointFlag, 'collisions', this.collisions, 'ball poss', this.position.x, this.position.z, 'target', target.position.x, target.position.z);
  //       if ( user.pointFlag === true && ((this.position.x - target.position.x) > -2) && ((this.position.x - target.position.x) < 2)  && ((this.position.z - target.position.z) < 2)  && ((this.position.z - target.position.z) < 2) ){
  //         endTurnAndUpdate(2);
  //       }
  //       //CHANGED FOR TESTING PURPOSES - POINT ASSIGNMENTS TBD
  //       else if ( user.pointFlag === true && ((this.position.x - target.position.x) > -2.5) && ((this.position.x - target.position.x) < 4.5)  && ((this.position.z - target.position.z) < 4.5)  && ((this.position.z - target.position.z) < 4.5) ){
  //         endTurnAndUpdate(1);
  //       }
  //       else {
  //      //   console.log('collisions', this.collisions, user.pointFlag);
  //         endTurnAndUpdate(0);
  //       }
  //     }
  //   }
    

  //   else if (singleplayer === true && user.turnNumber === 1 && user.usedSpaceBar === true) {
  //     user.turnNumber++;
  //     user.usedSpaceBar = false;
  //     switch ( this.collisions ) {
  //     case 3:
  //    //    console.log('PF', user.pointFlag, 'collisions', this.collisions, 'ball poss', this.position.x, this.position.z, 'target', target.position.x, target.position.z);
  //       if ( user.pointFlag === true && ((this.position.x - target.position.x) > -2) && ((this.position.x - target.position.x) < 2)  && ((this.position.z - target.position.z) < 2)  && ((this.position.z - target.position.z) < 2) ){
  //         endTurnAndUpdate(2);
  //       }
  //       //CHANGED FOR TESTING PURPOSES - POINT ASSIGNMENTS TBD
  //       else if ( user.pointFlag === true && ((this.position.x - target.position.x) > -4.5) && ((this.position.x - target.position.x) < 4.5)  && ((this.position.z - target.position.z) < 4.5)  && ((this.position.z - target.position.z) < 4.5) ){
  //         endTurnAndUpdate(1);
  //       }
  //       else {
  //         endTurnAndUpdate(0);
  //       }

  //     }
  //   }


  //   else if (singleplayer === false && user.turnNumber === 1 && user.usedSpaceBar === true){
  //     user.turnNumber++;
  //     user.usedSpaceBar = false;
  //     console.log('ballPosition@X', this.position.x)
  //     switch ( ++this.collisions ) {
  //     case 1:
  //       if ( user.pointFlag === true && ((this.position.x - target.position.x) > -2) && ((this.position.x - target.position.x) < 2)  && ((this.position.z - target.position.z) < 2)  && ((this.position.z - target.position.z) < 2) ){

  //         endTurnAndUpdate(2);
  //       }
  //       //CHANGED FOR TESTING PURPOSES - POINT ASSIGNMENTS TBD
  //       else if ( user.pointFlag === true && ((this.position.x - target.position.x) > -4.5) && ((this.position.x - target.position.x) < 4.5)  && ((this.position.z - target.position.z) < 4.5)  && ((this.position.z - target.position.z) < 4.5) ){
  //        endTurnAndUpdate(1);
  //       }
  //     case 3:
  //     console.log('P2 collisions', this.collisions);
  //       if ( user.pointFlag === true && ((this.position.x - target.position.x) > -2) && ((this.position.x - target.position.x) < 2)  && ((this.position.z - target.position.z) < 2)  && ((this.position.z - target.position.z) < 2) ){
  //         endTurnAndUpdate(2);
  //       }
  //       //CHANGED FOR TESTING PURPOSES - POINT ASSIGNMENTS TBD
  //       else if ( user.pointFlag === true && ((this.position.x - target.position.x) > -4.5) && ((this.position.x - target.position.x) < 4.5)  && ((this.position.z - target.position.z) < 4.5)  && ((this.position.z - target.position.z) < 4.5) ){
  //        endTurnAndUpdate(1);
  //       }
  //     default:
  //    console.log('P2 collisions', this.collisions);
  //   }

  // }


  //  else if (singleplayer === false && user.turnNumber !== 1){
  //   console.log('ballPosition@X', this.position.x)
  //     switch ( ++this.collisions ) {
  //     case 2:
  //     console.log('not turn #1', this.collisions)
  //       if ( user.pointFlag === true && ((this.position.x - target.position.x) > -2) && ((this.position.x - target.position.x) < 2)  && ((this.position.z - target.position.z) < 2)  && ((this.position.z - target.position.z) < 2) ){
  //         randomizeAndDisplayGravity();
  //         endTurnAndUpdate(2);
  //       }
  //       //CHANGED FOR TESTING PURPOSES - POINT ASSIGNMENTS TBD
  //       else if ( user.pointFlag === true && ((this.position.x - target.position.x) > -4.5) && ((this.position.x - target.position.x) < 4.5)  && ((this.position.z - target.position.z) < 4.5)  && ((this.position.z - target.position.z) < 4.5) ){
  //        endTurnAndUpdate(1);
  //       }
  //       else {
  //         endTurnAndUpdate(0);
  //       }
  //     default:
  //    // console.log('in here turn !== 1');
  //   }

  // }



/*
ORIGINAL CODE
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


*/



var moonNormal  = textureLoader.load('/assets/finalMoonPics/normal.jpg');
var moonMap = textureLoader.load('/assets/finalMoonPics/moonPic.jpg');
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
