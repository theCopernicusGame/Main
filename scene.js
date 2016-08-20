$(function(){
  // START THREE.JS
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

  //player 1 camera
  camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 0.1, 10000);
  camera.position.x = 13;
  camera.position.y = 3;
  camera.position.z = 0.67;

  // add earth w/ clouds to scene
  scene.add( earth );

  // add bumpers
  scene.add( bumper1 );
  scene.add( bumper2 );
  scene.add( bumper3 );

  // add ball
  scene.add( ball );

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



  var loader = new THREE.OBJLoader( manager );
  loader.load( 'assets/finalMoonPics/moon_floor.OBJ', function ( object ) {
    object.traverse( function ( child ) {
       if ( child instanceof THREE.Mesh ) {
          child.material.map = floorImage;
          child.receiveShadow = true;
        }
      });

    scene.add( object );
  });


//    ground_material = Physijs.createMaterial(
//             new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture( 'assets/finalMoonPics/Larissa-Texture.png' ) }),
//             .8, // high friction
//             .4 // low restitution
//         );
//         ground_material.map.wrapS = ground_material.map.wrapT = THREE.RepeatWrapping;
//         ground_material.map.repeat.set( 2.5, 2.5 );
//         
//         // Ground
//         NoiseGen = new SimplexNoise;
//         
//         ground_geometry = new THREE.PlaneGeometry( 75, 75, 50, 50 );
//         for ( var i = 0; i < ground_geometry.vertices.length; i++ ) {
//             var vertex = ground_geometry.vertices[i];
//             vertex.z = NoiseGen.noise( vertex.x / 20, vertex.y / 20 ) * 1.03;
//         }
//         ground_geometry.computeFaceNormals();
//         ground_geometry.computeVertexNormals();
//         
//         // If your plane is not square as far as face count then the HeightfieldMesh
//         // takes two more arguments at the end: # of x faces and # of y faces that were passed to THREE.PlaneMaterial
//         ground = new Physijs.HeightfieldMesh(
//             ground_geometry,
//             ground_material,
//             0, // mass
//             50,
//             50
//         );
//         ground.rotation.x = Math.PI / -2;
//         ground.receiveShadow = true;
//         scene.add( ground );

//fake floor (invisible)
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

  var ballHolder = new Physijs.BoxMesh(
    new THREE.CubeGeometry( 2, 0.1, 2 ),
    new THREE.MeshBasicMaterial({ color: 0x888888 }),
    0,
    50,
    50
  );

  ballHolder.position.set( 6, 1, -1 );
  ballHolder.visible = false;
  scene.add( ballHolder );






  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.addEventListener('change', render);

  scene.add( spotLight );
  scene.add( spotLight2 );

  var moved;

  render();
  function render() {

    scene.simulate(); // run physics

    earth.rotation.x += parameters.rotateX;
    earth.rotation.y -= parameters.rotateY;
    earth.rotation.z += parameters.rotateZ;

    cloudMesh.rotation.x -= parameters.cRotateX;
    cloudMesh.rotation.y -= parameters.cRotateY;

    if (moved === true && ball.position.x < 2) sendPosition();

    // SWITCH STATEMENT?
    if (keyboard[65]){
      sendPosition();
      moved = true;
      ball.setLinearVelocity(new THREE.Vector3(-1, 10, 0));
    }
     if (keyboard[87]){
      ball.setLinearVelocity(new THREE.Vector3(0, 14, 1));
    }
    if (keyboard[68]){
      ball.setAngularVelocity(new THREE.Vector3(-2, 0, 0));
    }
    if (keyboard[83]){
      ball.setAngularVelocity(new THREE.Vector3(0, 0, 0));
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
  let position = { 'type': 'ballPos', 'position': [ ball.position.x, ball.position.y ] };
  dataChannel.send(JSON.stringify(position));
}
