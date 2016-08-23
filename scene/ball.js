'use strict';

var textureLoader = new THREE.TextureLoader();
var ballGeometry = new THREE.SphereGeometry(.3, 28.8, 14.4),
handleCollision = function( collided_with, linearVelocity, angularVelocity ) {
        console.log(this.collisions + 1);
        switch ( ++this.collisions ) {
          case 3:
            // console.log('HIT GROUND!', collided_with.position, 'ball pos', this.position, 'target pos', target.position);
            console.log(user.pointFlag);
            if ( user.pointFlag === true && ((this.position.x - target.position.x) > -2) && ((this.position.x - target.position.x) < 2)  && ((this.position.z - target.position.z) < 2)  && ((this.position.z - target.position.z) < 2) ){
              user.points += 2;
              user.pointFlag = false;
              user.trackFlag = false;
              if (user.player === "user_1") $('#p1Points').text(user.points);
              else $('#p2Points').text(user.points);
              dataChannel.send(JSON.stringify({ 'points': 2 }));
              setTimeout(function() {
                moved = false;
                dataChannel.send(JSON.stringify({ 'moved': moved }));
                dataChannel.send(JSON.stringify({ 'turn': user.myTurn }));
                user.myTurn = false;
                scene.remove(ball);
                user.pointFlag = true;
                this.collisions = 0;
                addBall();
              }, 2000)
            }
            else if ( user.pointFlag === true && ((this.position.x - target.position.x) > -3.5) && ((this.position.x - target.position.x) < 3.5)  && ((this.position.z - target.position.z) < 3.5)  && ((this.position.z - target.position.z) < 3.5) ){
              user.points += 1;
              user.pointFlag = false;
              user.trackFlag = false;
              if (user.player === "user_1") $('#p1Points').text(user.points);
              else $('#p2Points').text(user.points);
              dataChannel.send(JSON.stringify({ 'points': 1 }));
              setTimeout(function() {
                moved = false;
                dataChannel.send(JSON.stringify({ 'moved': moved }));
                dataChannel.send(JSON.stringify({ 'turn': user.myTurn }));
                user.myTurn = false;
                scene.remove(ball);
                user.pointFlag = true;
                this.collisions = 0;
                addBall();
               }, 5000)
            }
            else {
              user.points += 1;
              user.pointFlag = false;
              user.trackFlag = false;
              if (user.player === "user_1") $('#p1Points').text(user.points);
              else $('#p2Points').text(user.points);
              dataChannel.send(JSON.stringify({ 'points': 1 }));
              user.pointFlag = false;
              user.trackFlag = false;
              setTimeout(function() {
                moved = false;
                dataChannel.send(JSON.stringify({ 'moved': moved }));
                dataChannel.send(JSON.stringify({ 'turn': user.myTurn }));
                user.myTurn = false;
                scene.remove(ball);
                user.pointFlag = true;
                this.collisions = 0;
                addBall();
               }, 5000)
            }

        }
    };

// MOVE COLLISION/GAME LOGIC FROM HERE TO CORRECT FILE

var moonNormal  = textureLoader.load('assets/finalMoonPics/normal.jpg');
var moonMap = textureLoader.load('assets/finalMoonPics/moonPic.jpg');
var ballTexture = new THREE.MeshPhongMaterial({ map: moonMap, normalMap: moonNormal });//TEST RED BALL FOR LOAD TIME
var ballTexture2 = new THREE.MeshPhongMaterial( { color: 0xFF0000} );


var ball = new Physijs.SphereMesh(ballGeometry, ballTexture, .3, .9 );
ball.castShadow = true;
ball.collisions = 0;
ball.__dirtyPosition = true;
ball.receiveShadow = true;
ball.addEventListener( 'collision', handleCollision );
ball.material.color.setHex(0xcc8855);

var ball2 = new Physijs.SphereMesh(ballGeometry, ballTexture, .3, .9 );
ball2.castShadow = true;
ball2.collisions = 0;
ball2.__dirtyPosition = true;
ball2.receiveShadow = true;
ball2.material.color.setHex(0xcc8855);
