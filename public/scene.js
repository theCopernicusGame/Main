$(function(){
  // START THREE.JS
  //FOR TESTING POINTS
  var pointsTest = true;

  Physijs.scripts.worker = 'lib/physijs_worker.js'; //webworker used to minimize latency re phys.js
  Physijs.scripts.ammo = 'ammo.js';

  // in case window changes
  function onWindowResize() {
     camera.aspect = window.innerWidth / window.innerHeight;
     camera.updateProjectionMatrix();
     renderer.setSize( window.innerWidth, window.innerHeight );
     render();
  }

  window.addEventListener( 'resize', onWindowResize, false );

  var camera, scene, renderer, mesh;
  var startTime  = Date.now();
  var keyboard = {};
  scene = new Physijs.Scene;
  scene.setGravity(new THREE.Vector3( 0, -20, 0 ));
  scene.addEventListener(
    'update',
    function() {
      scene.simulate( undefined, 2 );
    }
  );

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true} );
  renderer.setClearColor(0x000000, 0);
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.shadowMap.enabled = true;
  renderer.shadowMapSoft = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // choose camera
  camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 0.1, 10000);
  camera.position.x = 13;
  camera.position.y = 3;
  camera.position.z = 0;
  camera.lookAt(new THREE.Vector3(0,3,0))


  // add earth w/ clouds to scene
  scene.add( earth );

  // add ball
  if (user.myTurn === true) {
    ball.position.z = 0;
    ball.position.x = 5;
    ball.position.y = .35;
    scene.add( ball );
  } else {
    ball2.position.z = 0;
    ball2.position.x = -7;
    ball2.position.y = .35;
    scene.add( ball2 );
  }

  //add target
  scene.add( target );

  // add second target
  scene.add( target2 );

  // add astronaut
  objLoader.load( 'assets/astronaut/player2_body.OBJ', function ( object ) {
    object.traverse( function ( child ) {
         if ( child instanceof THREE.Mesh ) {
          child.material.map = imageMap;
          child.material.normalMap = normalMap;
          child.material.specularMap = specMap;
          child.castShadow = true;
        }
      });
    scene.add(object);
  });

  // add hand
  objLoader.load( 'assets/astronaut/player1_hand.OBJ', function ( object ) {
    object.traverse( function ( child ) {
       if ( child instanceof THREE.Mesh ) {
          child.material.map = imageMap;
          child.material.normalMap = normalMap;
          child.material.specualarMap = specMap;
          child.castShadow = true;
        }
      });

    scene.add( object );
  });

  // add moon floor
  var floorImage = new THREE.Texture();

  imgLoader.load('assets/finalMoonPics/Larissa-Texture.png', function(img) {
    floorImage.image = img;
    floorImage.needsUpdate = true;
  });

  objLoader.load( 'assets/finalMoonPics/moon_floor.OBJ', function ( object ) {
    object.traverse( function ( child ) {
       if ( child instanceof THREE.Mesh ) {
          child.material.map = floorImage;
          child.receiveShadow = true;
        }
      });
    scene.add( object );
  });

  //fake floor (invisible)
  scene.add( fakeFloor );

  // add lighting
  scene.add( spotLight );
  scene.add( spotLight2 );

  function render() {
    scene.simulate(); // run physics

    earth.rotation.x += parameters.rotateX;
    earth.rotation.y -= parameters.rotateY;
    earth.rotation.z += parameters.rotateZ;

    cloudMesh.rotation.x -= parameters.cRotateX;
    cloudMesh.rotation.y -= parameters.cRotateY;

    if (moved === true && user.myTurn === true) {
      displayMessage('Height: ' + Math.abs(ball.position.y), 'Distance: ' + Math.abs(ball.position.x - 6));
      sendPosition(Math.abs(ball.position.x - 6), Math.abs(ball.position.y), ball.position.z, ball.rotation.x, ball.rotation.y, ball.rotation.z);
    }

    // WHEN ANIMATION STOPS, BALL ON PLAYER 2'S SCREEN MOVES BACK TO STARTING POSITION--FIXING THIS WILL ALSO PROBABLY FLIX GLITCHINESS
    if (moved === true && user.myTurn === false) {
      ball2.position.x += message.position[0];
      ball2.position.y += message.position[1];
      ball2.position.z += message.position[2];
      ball2.rotation.x = -(message.rotation[0]);
      ball2.rotation.y = -(message.rotation[1]);
      ball2.rotation.z = -(message.rotation[2]);
    }

    if (keyboard[32] && pointsTest === true){ //AIMING AT TARGET FOR TESTING POINTS +2
      ball.setLinearVelocity(new THREE.Vector3(-5, 7, 0));
      sendPosition(Math.abs(ball.position.x - 6), Math.abs(ball.position.y), ball.position.z, ball.rotation.x, ball.rotation.y, ball.rotation.z);      moved = true;
      dataChannel.send(moved);
      pointsTest = false;
    }

    if (keyboard[83]) { /// 's' for stop
      moved = false;
      dataChannel.close();
      stopAnimation();
    }

    if (delayedTrackerMatches.counter >= 200 && delayedTrackerMatches.flag === true){
      console.log('sp1', delayedTrackerMatches.counter);
      ball.setLinearVelocity(new THREE.Vector3(-9, 13, 0));
      delayedTrackerMatches.flag = false;
      delayedTrackerMatches.counter = 0;
      //user.trackFlag = false; 
      demo.clear();
    }

    if (delayedTrackerMatches.counter >= 5 && delayedTrackerMatches.counter < 10 && delayedTrackerMatches.flag === true){
      console.log('sp2', delayedTrackerMatches.counter);
      ball.setLinearVelocity(new THREE.Vector3(-8.4, 12, 0));
      delayedTrackerMatches.flag = false;
      //ser.trackFlag = false; 
      delayedTrackerMatches.counter = 0;
      demo.clear();
    }

    if (delayedTrackerMatches.counter > 3 && delayedTrackerMatches.counter < 5 && delayedTrackerMatches.flag === true){
      console.log('sp3', delayedTrackerMatches.counter);
      ball.setLinearVelocity(new THREE.Vector3(-9, 13, 0));
      delayedTrackerMatches.flag = false;
      //user.trackFlag = false; 
      delayedTrackerMatches.counter = 0;
      demo.clear();
     }

    if (delayedTrackerMatches.counter > 0 && delayedTrackerMatches.counter <= 3 && delayedTrackerMatches.flag === true){
      console.log('sp4', delayedTrackerMatches.counter);
      ball.setLinearVelocity(new THREE.Vector3(-9, 13, 0));
      //user.trackFlag = false; 
      delayedTrackerMatches.flag = false;
      delayedTrackerMatches.counter = 0;
      demo.clear();
     }

    spaceScene = requestAnimationFrame( render );
    renderer.render( scene, camera );
  }

  render();

  function keyDown(event){
    keyboard[event.keyCode] = true;
  }

  function keyUp(event){
    keyboard[event.keyCode] = false;
  }

  window.addEventListener('keydown', keyDown);
  window.addEventListener('keyup', keyUp);

  // for appending game messages to the DOM
  $('#bg').append( renderer.domElement );
  
  //DIVS FOR WAITING ON USER 2, POINT TOTALS AND 'CLICK TO THROW' - JQUERY TO APPEAR/DISAPPER DIVS - POINTS DIV UPDATED BY BALL COLLISION WITH SURFACE(GAMEPLAY) 
  var throwBall = $( "<button id='throwBall' >click me when you're ready to throw!</button>" ); 
  var pointsDiv = $( "<div id='pointsDiv'>Player 1 Points: <span id ='p1Points'>" + user.points + "</span><br>Player 2 Points: <span id='p2Points'>" + user.points + " </span> </div>" ); 

  $('#bg').append(pointsDiv);
  $('#bg').append(throwBall);
  $('#pointsDiv').fadeOut(0);
  $('#throwBall').fadeOut(0);

});


function sendPosition(x, y, z, xr, yr, zr) {
  var toSend = { 'type': 'ballPos', 'position': [ x, y, z ], 'rotation': [ xr, yr, zr ] };
  dataChannel.send(JSON.stringify(toSend));
}

function stopAnimation() {
  cancelAnimationFrame( spaceScene );
  console.log('Animation stopped!')
}
