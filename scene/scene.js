Physijs.scripts.worker = 'lib/physijs_worker.js'; //webworker used to minimize latency re phys.js
Physijs.scripts.ammo = 'ammo.js';

// in case window changes


//to collect possible user change in angle; 
var userAngle = 45, userVelocity, userGravity, spaceScene, gravityCounter = 0; 

//to collect possible user change in angle;



function onWindowResize() {
   camera.aspect = window.innerWidth / window.innerHeight;
   camera.updateProjectionMatrix();
   renderer.setSize( window.innerWidth, window.innerHeight );
   render();
}

window.addEventListener( 'resize', onWindowResize, false );

var camera, renderer, mesh;
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
scene.add(target);
scene.add(cap1);
scene.add(cap2);
scene.add(cap3);
scene.add(cap4);
scene.add(cap5);
scene.add(cap6);

// add astronaut
objLoader.load( 'assets/astronaut/player2_body.obj', function ( object ) {
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
objLoader.load( 'assets/astronaut/player1_hand.obj', function ( object ) {
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

objLoader.load( 'assets/finalMoonPics/moon_floor.obj', function ( object ) {
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
scene.add( spotlight );
scene.add( spotlight2 );

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
    if (turnEnded === false) {
      storePosition();
    }
    sendPosition(xPos, yPos, zPos, xRot, yRot, zRot);
    checkForeverFall(); // still a problem with this "cannot read property 'a' of undefined in ammo.js"
  }

  // received condition
  if (moved === true && user.myTurn === false) {
    ball2.position.x = message.position[0];
    ball2.position.y = message.position[1];
    ball2.position.z = message.position[2];
    ball2.rotation.z = -(message.rotation[2]);
  }

  //user changed gravity
  if (user.changeGravityFlag === true){
    scene.setGravity(new THREE.Vector3( 0, user.changeGravityValue, 0 ));
    if (gravityCounter === 0){
      setTimeout(function(){
        console.log('gravityChange done', user.changeGravityValue); 
        user.changeGravityFlag = false}, 10000); 
      gravityCounter++; 
    }
  }

  // start sending condition, sets projectile motion, testing purposes only
  if (keyboard[32] && user.spaceBarFlag === true){
    user.spaceBarFlag = false;
    t = performance.now();
    var velocity = determineVelocity(18, userAngle);
    ball.setLinearVelocity(new THREE.Vector3(velocity[0], velocity[1], 0));
    delayedTrackerMatches.flag = false;
    user.trackFlag = false;
    delayedTrackerMatches.counter = 0;
    moved = true;
    if (turnEnded === false) {
      storePosition();
    }
    user.trackFlag = false;
    dataChannel.send(JSON.stringify({ 'moved': moved }));
    sendPosition((-7 + (5 - ball.position.x)), ball.position.y, ball.position.z, ball.rotation.x, ball.rotation.y, ball.rotation.z);
  }


  if (delayedTrackerMatches.trackFlag === true && user.trackFlag === true) {
    sendProjectile(delayedTrackerMatches.counter);
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


/* current velocity tiers:
2-12, 12-21, 21-70, 70-200
*/

function determineVelocity(trackerCount, angle) {
  const trackerToVelocityMult = 270;
  userVelocity = (1/trackerCount) * (1/ball._physijs.mass) * trackerToVelocityMult;
  v0 = parseFloat(userVelocity).toFixed(3);
  var radians = angle * (Math.PI/180);
  var vertV = userVelocity * Math.sin(radians);
  var horizV = -(userVelocity * Math.cos(radians));
  return [horizV, vertV];
}

function sendProjectile() {
  var velocity = determineVelocity(trackerCount, userAngle);
  t = performance.now();
  ball.setLinearVelocity(new THREE.Vector3(velocity[0], velocity[1], 0));
  v0 = parseFloat(userVelocity).toFixed(3);

  delayedTrackerMatches.flag = false;
  user.trackFlag = false;
  delayedTrackerMatches.counter = 0;
  moved = true;
  if (turnEnded === false) {
    storePosition();
  }
  dataChannel.send(JSON.stringify({ 'moved': moved }));
  sendPosition((-7 + (5 - ball.position.x)), ball.position.y, ball.position.z, ball.rotation.x, ball.rotation.y, ball.rotation.z);
  demo.clear();
}

