Physijs.scripts.worker = '/lib/physijs_worker.js'; //webworker used to minimize latency re phys.js
Physijs.scripts.ammo = 'ammo.js';

function onWindowResize() {
   camera.aspect = window.innerWidth / window.innerHeight;
   camera.updateProjectionMatrix();
   renderer.setSize( window.innerWidth, window.innerHeight );
   render();
}

// in case window size changes
window.addEventListener( 'resize', onWindowResize, false );

//to collect possible user change in angle;
var userAngle = 45, userVelocity, spaceScene;
var camera, renderer, mesh;
var keyboard = {};
scene = new Physijs.Scene;
scene.setGravity(new THREE.Vector3( 0, user.changeGravityValue, 0 ));
scene.addEventListener(
  'update',
  function() {
    scene.simulate( undefined, 2 );
  }
);

renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true } );
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
addBall = function() {
  if (user.myTurn === true) {
    ball.position.z = 0;
    ball.position.x = 5;
    ball.position.y = .3;
    ball.collisions = 0;
    scene.add( ball );
  } else {
    ball2.position.z = 0;
    ball2.position.x = -7;
    ball2.position.y = .3;
    ball.collisions = 0;
    scene.add( ball2 );
  }
}
addBall();

//add target
scene.add(target);
scene.add(cap1);
scene.add(cap2);
scene.add(cap3);
scene.add(cap4);
scene.add(cap5);
scene.add(cap6);

// add astronaut

objLoader.load( '/assets/astronaut/Astronaut.obj', function ( object ) {
  object.traverse( function ( child ) {
       if ( child instanceof THREE.Mesh ) {
        child.material.map = imageMap;
        child.material.normalMap = normalMap;
        child.material.specularMap = specMap;
        child.castShadow = true;
      }
    });

  object.position.x = -9.8;
  object.rotation.y = 64.4;
  scene.add(object);
});

// add hand
// objLoader.load( '/assets/astronaut/player1_hand.obj', function ( object ) {
//   object.traverse( function ( child ) {
//        if ( child instanceof THREE.Mesh ) {
//         child.material.map = imageMap;
//         child.material.normalMap = normalMap;
//         child.material.specualarMap = specMap;
//         child.castShadow = true;
//       }
//     });
//
//   scene.add( object );
// });

// add moon floor
var floorImage = new THREE.Texture();
var floorMap = new THREE.Texture();

imgLoader.load('/assets/finalMoonPics/moonTexture.png', function(img) {
  floorImage.image = img;
  floorImage.image.wrapS = THREE.RepeatWrapping;
  floorImage.image.wrapT = THREE.RepeatWrapping;
  floorImage.needsUpdate = true;
});


imgLoader.load('/assets/finalMoonPics/moonNormals.jpeg', function(img) {
  floorMap.image = img;
  floorMap.needsUpdate = true;
});

objLoader.load( '/assets/finalMoonPics/moon_floor.obj', function ( object ) {
  object.traverse( function ( child ) {
       if ( child instanceof THREE.Mesh ) {
        child.material.map = floorImage;
        child.material.normalMap = floorMap;
        child.receiveShadow = true;
      }
    });
  scene.add( object );
});

//fake floor (invisible)
scene.add( fakeFloor );

// add lighting
scene.add( spotlight );
scene.add( spotlight2 );

function render() {

  // run physics
  scene.simulate();
  scene.setGravity(new THREE.Vector3( 0, user.changeGravityValue, 0 ));

  earth.rotation.x += parameters.rotateX;
  earth.rotation.y -= parameters.rotateY;
  earth.rotation.z += parameters.rotateZ;

  cloudMesh.rotation.x -= parameters.cRotateX;
  cloudMesh.rotation.y -= parameters.cRotateY;

  // continue send condition
  if (moved === true && user.myTurn === true) {
    var xPos = -7 + (5 - ball.position.x);
    var yPos = ball.position.y;
    var zPos = ball.position.z;
    var xRot = ball.rotation.x
    var yRot = ball.rotation.y
    var zRot = ball.rotation.z;
    displayPosition('Height: ' + parseFloat(ball.position.y - .3).toFixed(3) + 'm', 'Distance: ' + parseFloat(5 - ball.position.x).toFixed(3) + 'm');
    if (turnEnded === false) {
      storePosition();
      checkBadThrow();
    }
    if (singleplayer === false) {
      sendPosition(xPos, yPos, zPos, xRot, yRot, zRot);
    }
  }

  // received condition
  if (moved === true && user.myTurn === false) {
    ball2.position.x = message.position[0];
    ball2.position.y = message.position[1];
    ball2.position.z = message.position[2];
    ball2.rotation.z = -(message.rotation[2]);
  }

  // start sending condition, sets projectile motion, testing purposes only
  if (user.spaceBarFlag === true) {
    throwProjectile();
  }

  if (delayedTrackerMatches.trackFlag === true && user.trackFlag === true) {
    var lowLimit, upLimit;

    // find lower tracker matches limit

    // find upper tracker matches limit

    // find lower velocity limit
    if (user.changeGravityValue >= -3.6) lowLimit = 1.5;
    else if (user.changeGravityValue >= -6) lowLimit = 2.0;
    else if (user.changeGravityValue >= -8.4) lowLimit = 2.5;
    else lowLimit = 3.0;

    // calculate upper velocity limit
    upLimit = ((user.changeGravityValue + 1.6) / .4) * .5 + 9;

    // calculate velocity
    if (delayedTrackerMatches.counter > 50) delayedTrackerMatches.counter = 50;
    userVelocity = upLimit - (delayedTrackerMatches.counter / 50) * (upLimit - lowLimit);

    // demo purposes only
    // if (delayedTrackerMatches.counter > 0 && delayedTrackerMatches.counter <= 5) userVelocity = 6.5;
    // if (delayedTrackerMatches.counter > 5 && delayedTrackerMatches.counter <= 10) userVelocity = 6;
    // if (delayedTrackerMatches.counter > 10 && delayedTrackerMatches.counter <= 14) userVelocity = 5.5;
    // if (delayedTrackerMatches.counter > 14 && delayedTrackerMatches.counter <= 19) userVelocity = 5;
    // if (delayedTrackerMatches.counter > 19 && delayedTrackerMatches.counter <= 25) userVelocity = 4.5;
    // if (delayedTrackerMatches.counter > 25) userVelocity = 3.5;

    throwProjectile();
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

function sendPosition(x, y, z, xr, yr, zr) {
  var toSend = { 'type': 'ballPos', 'position': [ x, y, z ], 'rotation': [ xr, yr, zr ] };
  dataChannel.send(JSON.stringify(toSend));
}

function determineVelocity(velocity, angle) {
  v0 = parseFloat(userVelocity).toFixed(3);
  var radians = angle * (Math.PI/180);
  var vertV = userVelocity * Math.sin(radians);
  var horizV = -(userVelocity * Math.cos(radians));
  return [horizV, vertV];
}

function throwProjectile() {
  var velocity = determineVelocity(userVelocity, userAngle);
  t = performance.now();
  ball.setLinearVelocity(new THREE.Vector3(velocity[0], velocity[1], 0));
  user.spaceBarFlag = false;
  delayedTrackerMatches.trackFlag = false;
  user.trackFlag = false;
  delayedTrackerMatches.counter = 0;
  if (turnEnded === false) {
    storePosition();
  }
  moved = true;
  if (singleplayer === false) {
    sendPosition((-7 + (5 - ball.position.x)), ball.position.y, ball.position.z, ball.rotation.x, ball.rotation.y, ball.rotation.z);
    dataChannel.send(JSON.stringify({ 'moved': moved }));
  }
  demo.clear();
}
