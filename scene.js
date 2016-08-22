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
  camera.position.z = 0;
  camera.lookAt(new THREE.Vector3(0,3,0))


  // add earth w/ clouds to scene
  scene.add( earth );

  // add ball
  scene.add( ball );

  //add target
  scene.add( target );

  //add second target
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


  box = new Physijs.BoxMesh(
            new THREE.CubeGeometry( 30, 1, 10 ),
            new THREE.MeshBasicMaterial({ color: 0x888888 }),
            0,
            50,
            50
        );

  box.position.set( 0, -0.5, 0 );
  box.visible = false;
  scene.add( box );

  //ball start

  // var ballHolder = new Physijs.BoxMesh(
  //   new THREE.CubeGeometry( 2, 0.1, 2 ),
  //   new THREE.MeshBasicMaterial({ color: 0x888888 }),
  //   0,
  //   50,
  //   50
  // );

  // ballHolder.position.set( 6, 1, 0 );
  // ballHolder.visible = false;
  // scene.add( ballHolder );


 

  // add ground plane
  //scene.add( ground );

  //fake floor (invisible)
  scene.add( fakeFloor );

  //ball holder for ball starting position (invisible)
  scene.add( ballHolder );


  // add lighting
  scene.add( spotLight );
  scene.add( spotLight2 );

  //  MULTIPLAYER 'WORKS', BUT ISNT AT ALL OPTIMAL. GAME NEEDS TO BECOME TURN-BASED. POSITION IN X DIRECTION NEEDS TO BE FLIPPED.
  // IT NEEDS TO WORK BOTH WAYS. SETTIMEOUT METHOD IS KINDA HACKY, AND MAKES IT SO USER_2'S SCREEN IS WRONG FOR A FRACTION OF A SECOND.
  function render() {
    scene.simulate(); // run physics

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
      ball.setLinearVelocity(new THREE.Vector3(-1, 10, 0));
    }
    if (keyboard[32] && pointsTest === true){ //AIMING AT TARGET FOR TESTING POINTS +2
      ball.setLinearVelocity(new THREE.Vector3(-9, 13, 0));
      pointsTest = false;
    }
     if (keyboard[67] && pointsTest === true){ //AIMING AT TARGET FOR TESTING POINTS +1
      ball.setLinearVelocity(new THREE.Vector3(-8.4, 12, 0));
      pointsTest = false;
    }

    if (keyboard[83]) {
      if (user.myTurn === false) user.myTurn = true;
      else user.myTurn = false;
      console.log(user.myTurn);
    }

    if (newFinalTime.counter >= 10 && newFinalTime.flag === true){
      console.log('sp1', finalTime.counter);
      ball.setLinearVelocity(new THREE.Vector3(-9, 13, 0));
      newFinalTime.flag = false;
      newFinalTime.counter = 0;
      demo.clear();
    }

    if (newFinalTime.counter >= 5 && newFinalTime.counter < 10 && newFinalTime.flag === true){
      console.log('sp2', newFinalTime.counter);
      ball.setLinearVelocity(new THREE.Vector3(-8.4, 12, 0));
      newFinalTime.flag = false;
      newFinalTime.counter = 0;
      demo.clear();
    }

    if (newFinalTime.counter > 3 && newFinalTime.counter < 5 && newFinalTime.flag === true){
      console.log('sp3', finalTime.counter);
      ball.setLinearVelocity(new THREE.Vector3(-5, 10, 0));
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
  
  //DIVS FOR WAITING ON USER 2, POINT TOTALS AND 'CLICK TO THROW' - JQUERY TO APPEAR/DISAPPER DIVS - POINTS DIV UPDATED BY BALL COLLISION WITH SURFACE(GAMEPLAY) 
  var throwBall = $( "<button id='throwBall' >click me when you're ready to throw!</button>" ); 
  var pointsDiv = $( "<div id='pointsDiv'>Player 1 Points: <span id ='p1Points'>" + user.points + "</span><br>Player 2 Points: <span id='p2Points'>" + user.points + " </span> </div>" ); 
  $('#bg').append(pointsDiv);
  $('#bg').append(throwBall);
  $('#pointsDiv').fadeOut(0);
  $('#throwBall').fadeOut(0);
  
  //CLICK TO ENABLE TRACKING SOFTWARE - TRACKING SOFTWARE DISABLED ON BALL CONTACT WITH SURFACE
  $('.loading-container').click(function(){
    console.log('clicked ready!'); 
    $('#throwBall').hide(500); 
    demo.tick(); 
    });
 
  var waiting = $( "<div id='waiting'>Waiting for player 2</div>" ); 
  $('#bg').append(waiting); 
  setTimeout(function(){$('#waiting').animate({'margin-top': "90%"}, 1500)},5000); 
 
   
});

function sendPosition() {
  message = { 'type': 'ballPos', 'position': [ ball.position.x, ball.position.y, ball.position.z ] };
  dataChannel.send(JSON.stringify(message));
}
