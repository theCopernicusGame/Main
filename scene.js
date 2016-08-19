$(function(){

  //THE FOLLOWING IS TRACKING HANDS USING JS-HANDTRACKING
  var finalTime = { runTime: undefined}, counter2 = 0;
  var DEMO = function(){
    startTime = undefined, endTime = undefined;
    this.startTime = startTime; this.endTime = endTime, this.finalTime = undefined, this.skinner = undefined;
  };

  DEMO.prototype.start = function() {
    var that = this;
    this.tracker = new HT.Tracker();
    this.video = document.getElementById("myVideo");
    this.canvas = document.getElementById("canvas");
    this.context = this.canvas.getContext("2d");
    this.canvas.width = parseInt(this.canvas.style.width);
    this.canvas.height = parseInt(this.canvas.style.height);
    this.image = this.context.createImageData(
    this.canvas.width * 0.2, this.canvas.height * 0.2);
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    if (navigator.getUserMedia){
      navigator.getUserMedia({video: true},
      function(stream){ return that.videoReady(stream); },
      function(error){ return that.videoError(error); } );
    }
  };

  DEMO.prototype.videoReady = function(stream){
    if (window.webkitURL) {
      this.video.src = window.webkitURL.createObjectURL(stream);
    } else if (video.mozSrcObject !== undefined) {
      this.video.mozSrcObject = stream;
    } else {
      this.video.src = stream;
    }
    this.tick();
  };

  DEMO.prototype.videoError = function(error){
  };

  DEMO.prototype.tick = function(){
    var that = this, image, candidate;
    requestAnimationFrame( function() { return that.tick(); } );
    if (this.video.readyState === this.video.HAVE_ENOUGH_DATA){
      image = this.snapshot();

      candidate = this.tracker.detect(image);

      this.draw(candidate);
    }
  };

  DEMO.prototype.snapshot = function(){
    this.context.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);

    return this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
  };

  DEMO.prototype.draw = function(candidate){
    if (candidate){
      this.drawHull(candidate.hull, "red");
      this.drawDefects(candidate.defects, "blue");
      this.context.putImageData(
      this.createImage(this.tracker.mask, this.image),
      this.canvas.width - this.image.width,
      this.canvas.height - this.image.height);
    }
  };

  DEMO.prototype.drawHull = function(hull, color){
    finalTime = this.tracker.returnTimeObj(); //THIS IS THE ADDED METHOD THAT RETURNS THE OBJECT CAPTURING THE SPEED OF THE PLAYERS HAND
    var len = hull.length, i = 1;
    if (len > 0){
      this.context.beginPath();
      this.context.lineWidth = 3;
      this.context.strokeStyle = color;
      this.context.moveTo(hull[0].x, hull[0].y);
      if (hull[0].y > 0  && hull[0].x > 60 && hull[0].x < 90 & this.startTime === undefined){
        //console.log('yStart', hull[0].y);
        this.startTime = Date.now();
        //console.log('start', (this.startTime / 1000) % 60); //KEPT IN TO TEST TRACKING
      }
      if (hull[0].y > 110 && this.startTime !== undefined && this.endTime === undefined){
       // console.log('yEnd', hull[0].y);
        this.endTime = Date.now();
        this.finalTime = this.endTime - this.startTime;
       // console.log('endTime', this.endTime);
       // console.log('howMuch', (this.finalTime / 1000) % 60);
        finalTime = (this.finalTime / 1000) % 60;
        //this.startTime = undefined, this.endTime = undefined;  //MULTIPLE THROWS POSSIBLE WITH THIS
      }

      for (; i < len; ++ i){
        this.context.lineTo(hull[i].x, hull[i].y);
      }
      this.context.stroke();
      this.context.closePath();
    }
  };

  DEMO.prototype.drawDefects = function(defects, color){
    var len = defects.length, i = 0, point;
    if (len > 0){
      this.context.beginPath();
      this.context.lineWidth = 3;
      this.context.strokeStyle = color;
    for (; i < len; ++ i){
      point = defects[i].depthPoint;
      this.context.strokeRect(point.x - 4, point.y - 4, 8, 8);
    }
    this.context.stroke();
    this.context.closePath();
    }
  };

  DEMO.prototype.createImage = function(imageSrc, imageDst){
    var src = imageSrc.data, dst = imageDst.data,
      width = imageSrc.width, span = 4 * width,
      len = src.length, i = 0, j = 0, k = 0, fun = dst;
    for(i = 0; i < len; i += span){
      for(j = 0; j < width; j += 5){
        dst[k] = dst[k + 1] = dst[k + 2] = src[i];
        dst[k + 3] = 255;
        k += 4;
        i += 5;
      }
    }
       
    return imageDst;
  };

  $('#canvas').css('visibility', 'hidden');
  var demo = new DEMO();
  demo.start();

  // END TRACKING CODE

  // START THREE.JS
  Physijs.scripts.worker = 'lib/physijs_worker.js'; //webworker used to minimize latency re phys.js
  Physijs.scripts.ammo = 'ammo.js';

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


  //ground plane
  floorRocks = textureLoader.load('assets/finalMoonPics/Larissa-Texture.png');
  var loader = new THREE.OBJLoader( manager );
  loader.load( 'assets/finalMoonPics/moon_floor.OBJ', function ( object ) {
    object.traverse( function ( child ) {
       if ( child instanceof THREE.Mesh ) {
          child.material.map = floorRocks;
        }
      });
    scene.add( object );
  });


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

    if (moved === true && ball.position.z < 2) sendPosition();

    // SWITCH STATEMENT?
    if (keyboard[65]){
      sendPosition();
      moved = true;
      ball.setLinearVelocity(new THREE.Vector3(0, 10, 1));
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

    if (finalTime < .15){
       console.log('fT', finalTime);
       ball.setLinearVelocity(new THREE.Vector3(0, 15, 1));
       finalTime = undefined;
    }
    if (finalTime > .15 && finalTime < .3){
       console.log('fT', finalTime);
       ball.setLinearVelocity(new THREE.Vector3(0, 11, 1));
       finalTime = undefined;
    }
    if (finalTime > .3){
      console.log('fT', finalTime);
       ball.setLinearVelocity(new THREE.Vector3(0, 8, 1));
      finalTime = undefined;
    }

    if (finalTime.runTime <= .03){
      console.log('sp6', finalTime.runTime);
      ball.setLinearVelocity(new THREE.Vector3(0, 15, 1));
      finalTime.runTime = undefined;
     }

    if (finalTime.runTime > .03 && finalTime.runTime <= .06){
      console.log('sp5', finalTime.runTime);
      ball.setLinearVelocity(new THREE.Vector3(0, 13, 1));
      finalTime.runTime = undefined;
     }
    if (finalTime.runTime > .06 && finalTime.runTime <= .1){
      console.log('sp4', finalTime.runTime);
      ball.setLinearVelocity(new THREE.Vector3(0, 11, 1));
      finalTime.runTime = undefined;
     }
    if (finalTime.runTime > .1 && finalTime.runTime <= .15){
      console.log('sp3', finalTime.runTime);
      ball.setLinearVelocity(new THREE.Vector3(0, 9, 1));
      finalTime.runTime = undefined;
     }
    if (finalTime.runTime > .15 && finalTime.runTime <= .3){
      console.log('sp2', finalTime.runTime);
      ball.setLinearVelocity(new THREE.Vector3(0, 7, 1));
      finalTime.runTime = undefined;
     }
    if (finalTime.runTime > .3 && finalTime.runTime <= 1){
      console.log('sp1', finalTime.runTime);
      ball.setLinearVelocity(new THREE.Vector3(0, 5, 1));
      finalTime.runTime = undefined;
     }
    if (finalTime.runTime > 1){
      console.log('sp0', finalTime.runTime);
      ball.setLinearVelocity(new THREE.Vector3(0, 3, 1));
      finalTime.runTime = undefined;
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

// ADD DISTANCE PART AND FIX FORMATTING OF OBJECTS PASSED INTO DATA CHANNEL
function sendPosition() {
  let position = { 'type': 'ballPos', 'position': [ ball.position.z, ball.position.y ] };
  dataChannel.send(JSON.stringify(position));
}


// function onWindowResize() {
//    camera.aspect = window.innerWidth / window.innerHeight;
//    camera.updateProjectionMatrix();
//    renderer.setSize( window.innerWidth, window.innerHeight );
//    render();
// }
