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

var camera, renderer, mesh;
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

  // run physics
  scene.simulate();

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
    displayPosition('Height: ' + parseFloat(ball.position.y - .3).toFixed(3), 'Distance: ' + parseFloat(5 - ball.position.x).toFixed(3));
    sendPosition(xPos, yPos, zPos, xRot, yRot, zRot);
  }

  // received condition
  if (moved === true && user.myTurn === false) {
    ball2.position.x = message.position[0];
    ball2.position.y = message.position[1];
    ball2.position.z = message.position[2];
    // ball2.rotation.x = -(message.rotation[0]); one of these is buggy
    // ball2.rotation.y = -(message.rotation[1]);
    ball2.rotation.z = -(message.rotation[2]);
  }

  // start sending condition, sets projectile motion, testing purposes only
  if (keyboard[32]){
    ball.setLinearVelocity(new THREE.Vector3(-10.5, 10.5, 0));
    moved = true;
    user.trackFlag = false; 
    dataChannel.send(JSON.stringify({ 'moved': moved }));
    sendPosition((-7 + (5 - ball.position.x)), ball.position.y, ball.position.z, ball.rotation.x, ball.rotation.y, ball.rotation.z);
  }

  // press 's' to stop sending and animation, testing purposes only
  if (keyboard[83]) {
    moved = false;
    dataChannel.close();
    stopAnimation();
  }

  if (delayedTrackerMatches.flag === true && user.trackFlag === true) sendProjectile(delayedTrackerMatches.counter);

  var spaceScene = requestAnimationFrame( render );
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

/* current velocity tiers:
2-12, 12-21, 21-70, 70-200
*/
function determineVelocity(trackerCount) {
  if (trackerCount < 21) trackerCount = 21;
  const trackerToVelocityMult = 525;
  var velocity = (1/trackerCount) * trackerToVelocityMult;
  return velocity;
}

function sendProjectile(trackerCount) {
  var velocity = determineVelocity(trackerCount);
  ball.setLinearVelocity(new THREE.Vector3(-velocity, velocity, 0));
  delayedTrackerMatches.flag = false;
  user.trackFlag = false;
  delayedTrackerMatches.counter = 0;
  moved = true;
  dataChannel.send(JSON.stringify({ 'moved': moved }));
  sendPosition((-7 + (5 - ball.position.x)), ball.position.y, ball.position.z, ball.rotation.x, ball.rotation.y, ball.rotation.z);
  demo.clear();
}

function stopAnimation() {
  cancelAnimationFrame( spaceScene );
  console.log('Animation stopped!')
}
