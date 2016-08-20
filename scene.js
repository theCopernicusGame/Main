$(function(){
  // START THREE.JS

  var userObj = {pointFlag: true, points: 0}

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

  var camera, scene, renderer, mesh, moved;
  var startTime  = Date.now();
  displaygui();
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
  camera.position.z = 0.67;

  // add earth w/ clouds to scene
  scene.add( earth );


  // add moonscape as ground 
  scene.add( ground );

  // add ball
  scene.add( ball );

  //add target
  scene.add( target );

  //add second target
  scene.add( target2 ); 

  // add astronaut
  var loader = new THREE.OBJLoader( manager );
  loader.load( 'assets/astronaut/player2_body.OBJ', function ( object ) {
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
  var loader = new THREE.OBJLoader( manager );
  loader.load( 'assets/astronaut/player1_hand.OBJ', function ( object ) {
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




 

  // add ground plane
  scene.add( ground );



  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.addEventListener('change', render);

  // add lighting
  scene.add( spotLight );
  scene.add( spotLight2 );

  //  MULTIPLAYER 'WORKS', BUT ISNT AT ALL OPTIMAL. GAME NEEDS TO BECOME TURN-BASED. POSITION IN X DIRECTION NEEDS TO BE FLIPPED.
  // IT NEEDS TO WORK BOTH WAYS. SETTIMEOUT METHOD IS KINDA HACKY, AND MAKES IT SO USER_2'S SCREEN IS WRONG FOR A FRACTION OF A SECOND.
  function render() {
    scene.simulate(); // run physics

    //POINTS BASED ON X,Y COORDINATES - DRAFT OF LOGIC
    if ( userObj.pointFlag === true && ((ball.position.x - target.position.x) > -2) && ((ball.position.x - target.position.x) < 2)  && ((ball.position.z - target.position.z) < 2)  && ((ball.position.z - target.position.z) < 2) ){
      userObj.points += 2; 
      userObj.pointFlag = false; 
      console.log("Player points increased!", userObj); 
    } 
    else if ( userObj.pointFlag === true && ((ball.position.x - target.position.x) > -3) && ((ball.position.x - target.position.x) < 3)  && ((ball.position.z - target.position.z) < 3)  && ((ball.position.z - target.position.z) < 3) ){ 
      userObj.points += 1; 
      userObj.pointFlag = false; 
      console.log("Player points increased!", userObj); 
    } 


    earth.rotation.x += parameters.rotateX;
    earth.rotation.y -= parameters.rotateY;
    earth.rotation.z += parameters.rotateZ;

    cloudMesh.rotation.x -= parameters.cRotateX;
    cloudMesh.rotation.y -= parameters.cRotateY;

    if (moved === true && user.myTurn === true) sendPosition();
    if (user.myTurn === false) {
      ball.position.x = ball.position.x - message.position[0];
      ball.position.y = message.position[1];
      ball.position.z = ball.position.z - message.position[2];
    }

    if (keyboard[65] && user.myTurn === true){
      sendPosition();
      moved = true; 
    }
     if (keyboard[87]){
      ball.setLinearVelocity(new THREE.Vector3(0, 0, 1));
    }
    if (keyboard[68]){
      ball.setLinearVelocity(new THREE.Vector3(-2, 0, 0));
    }
    if (keyboard[83]){
      ball.setLinearVelocity(new THREE.Vector3(0, 0, -1));
    }
    if (keyboard[49]){
      scene.setGravity(new THREE.Vector3( 0, -20, 0 ));
    }
    if (keyboard[50]){
      scene.setGravity(new THREE.Vector3( 0, -10, 0 ));
    }
    if (keyboard[51]){
      scene.setGravity(new THREE.Vector3( 0, -60, 0 ));
    }

    if (keyboard[83]) {
      if (user.myTurn === false) user.myTurn = true;
      else user.myTurn = false;
      console.log(user.myTurn);
    }

    if (newFinalTime.counter >= 10 && newFinalTime.flag === true){
      console.log('sp1', finalTime.counter);
      ball.setLinearVelocity(new THREE.Vector3(0, 2, 1));
      newFinalTime.flag = false;
      newFinalTime.counter = 0;
      demo.clear();
    }

    if (newFinalTime.counter >= 5 && newFinalTime.counter < 10 && newFinalTime.flag === true){
      console.log('sp2', newFinalTime.counter);
      ball.setLinearVelocity(new THREE.Vector3(0, 6, 1));
      newFinalTime.flag = false;
      newFinalTime.counter = 0;
      demo.clear();
    }

    if (newFinalTime.counter > 3 && newFinalTime.counter < 5 && newFinalTime.flag === true){
      console.log('sp3', finalTime.counter);
      ball.setLinearVelocity(new THREE.Vector3(0, 10, 1));
      newFinalTime.flag = false;
      newFinalTime.counter = 0;
      demo.clear();
     }

    if (newFinalTime.counter > 0 && newFinalTime.counter <= 3 && newFinalTime.flag === true){
      console.log('sp4', finalTime.counter);
      ball.setLinearVelocity(new THREE.Vector3(0, 15, 1));
      newFinalTime.flag = false;
      newFinalTime.counter = 0;
      demo.clear();
     }

    requestAnimationFrame( render );
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

  $('#bg').append( renderer.domElement ); 

});

function sendPosition() {
  message = { 'type': 'ballPos', 'position': [ ball.position.x, ball.position.y, ball.position.z ] };
  dataChannel.send(JSON.stringify(message));
}
