// 'use strict';
$(function(){

  //PLAYER MOVEMENT TRACKING CODE

  //THE FOLLOWING IS TRACKING HANDS IN JS-HANDTRACKING
  var finalTime; 
  var DEMO = function(){
    this.startTime = undefined; this.endTime = undefined, this.finalTime = undefined;   
  };

  DEMO.prototype.start = function() {
    var that = this; 

    this.tracker = new HT.Tracker();

  // this.cbxHull = document.getElementById("cbxHull");
  // this.cbxDefects = document.getElementById("cbxDefects");
  // this.cbxSkin = document.getElementById("cbxSkin");

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
  
  //REFACTOR BELOW, NO NEED FOR CONDITIONALS IN OUR APP
  DEMO.prototype.draw = function(candidate){
    if (candidate){
      if (true){
        this.drawHull(candidate.hull, "black");
      }
      if (true){
        this.drawDefects(candidate.defects, "black");
      }
    }
    if (true){
      this.context.putImageData(
      this.createImage(this.tracker.mask, this.image), 
      this.canvas.width - this.image.width,
      this.canvas.height - this.image.height);
    }
  };

  DEMO.prototype.drawHull = function(hull, color){
    var len = hull.length, i = 1;
    if (len > 0){
      this.context.beginPath();
      this.context.lineWidth = 3;
      this.context.strokeStyle = color;
      this.context.moveTo(hull[0].x, hull[0].y);
      //console.log('Y coordinate', hull[0].y); 
      //console.log('start', this.startTime); 
      if (hull[0].y > 85 && this.startTime === undefined){
        this.startTime = Date.now(); 
        console.log('start', (this.startTime / 1000) % 60); 
      }
      if (hull[0].y < 75 && this.startTime !== undefined && this.endTime === undefined){
        this.endTime = Date.now();
        this.finalTime = this.endTime - this.startTime; 
        console.log('endTime', this.endTime); 
        console.log('howMuch', (this.finalTime / 1000) % 60);
        finalTime = (this.finalTime / 1000) % 60; 
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

   
//THIS IS THE END OF THE JS-HANDTRACKING CODE



//THE FOLLOWING IS TRACKING COLORS IN TRACKING.JS

//    var colors = new tracking.ColorTracker(['magenta']);

//   var start, start2, end, end2, time, time2; 
//   console.log('NOW in tracking ish', colors); 

//   colors.on('track', function(event) {
    
//     if (event.data.length === 0) {
//     //console.log('No colors were detected in this frame.'); 
//     } else {
//       event.data.forEach(function(rect) {
//       //console.log(rect.y);
//       //console.log('time', Date.now());
//       if ( start === undefined && rect.y > 45) {
//         start = Date.now(); 
//         console.log('start', start);
//       }

//       if ( start !== undefined && end === undefined && rect.y < 20) {
//         end = Date.now();
//         console.log('start', start,'end', end);
//         time = end - start;
//         console.log("time " + (time / 1000) % 60);
//       }
//       if (time !== undefined && start2 === undefined && rect.y > 45){
//         start2 = Date.now(); 
//         console.log('start2', start2);
//       }
//       if ( time !== undefined && start2 !== undefined && end2 === undefined && rect.y < 20) {
//         end2 = Date.now();
//         console.log('start2', start2,'end2', end2);
//         time2 = end2 - start2;
//         console.log("time2 " + (time2 / 1000) % 60);
//       }

//      }); 
//    }
//   });


//   console.log('in doc ready'); 
//  tracking.track('#myVideo', colors, {camera: true});
//  $('#myVideo').css('visibility', 'hidden');
   
   //END OF TRACKING COLORS IN TRACKING.JS

  //END OF PLAYER MOVEMENT TRACKING CODE

  Physijs.scripts.worker = 'lib/physijs_worker.js'; //webworker are not slowing down app with phy
  Physijs.scripts.ammo = 'ammo.js';


  var camera, scene, renderer, mesh;
  var startTime  = Date.now();
  displaygui();
  var keyboard = {};
  var astronaut = {};
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
  renderer.setSize( 1280,720 );
  renderer.shadowMap.enabled = true;
  renderer.shadowMapSoft = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;


  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, .1, 1500);
  camera.position.x = 0;
  camera.position.y = 1;
  camera.position.z = 8;

  var earthGeometry = new THREE.SphereGeometry(36, 28.8, 14.4);
  var textureLoader = new THREE.TextureLoader();
  earthMap  = textureLoader.load('assets/earthPics/earthmap1k.jpg');
  earthBump = textureLoader.load('assets/earthPics/earthbump1k.jpg');
  earthSpec = textureLoader.load('assets/earthPics/earthspec1k.jpg');
  var earthTexture = new THREE.MeshPhongMaterial( { map: earthMap, bumpMap: earthBump, specularMap: earthSpec} );
  earth = new THREE.Mesh(earthGeometry, earthTexture );
  earth.position.z = -450;
  earth.position.x = -170;
  earth.position.y = 120;
  earth.castShadow = true;
  scene.add( earth );


  var cloudGeometry   = new THREE.SphereGeometry(37, 28.8, 14.4);
  canvasCloud = textureLoader.load('assets/earthPics/fair_clouds_4k.png');
  var cloudMaterial  = new THREE.MeshPhongMaterial( {map: canvasCloud, transparent: true, depthWrite: false, opacity: .7} );
  var cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
  earth.add(cloudMesh);

  var bumper,
  bumper_geom = new THREE.CubeGeometry(.5, .3, 1.5);
  bumperMaterial = new THREE.MeshLambertMaterial( { color: 0xFF0000 } );


  bumper1 = new Physijs.BoxMesh( bumper_geom, bumperMaterial, 0, { restitution: .2 } );
  bumper1.position.z = 2.5;
  bumper1.position.y = -.1;
  bumper1.position.x = .5;
  bumper1.receiveShadow = true;
  bumper1.castShadow = true;
  scene.add( bumper1 );

  bumper2 = new Physijs.BoxMesh( bumper_geom, bumperMaterial, 0, { restitution: .2 } );
  bumper2.position.z = 2.5;
  bumper2.position.y = -.1;
  bumper2.position.x = 2.5;
  bumper2.receiveShadow = true;
  bumper2.castShadow = true;
  scene.add( bumper2 );

  bumper3 = new Physijs.BoxMesh( bumper_geom, bumperMaterial, 0, { restitution: .2 } );
  bumper3.position.z = 3;
  bumper3.position.y = -.1;
  bumper3.position.x = 1.5;
  bumper3.rotation.y = Math.PI / 2;
  bumper3.receiveShadow = true;
  bumper3.castShadow = true;
  scene.add( bumper3 );


  var ballGeometry = new THREE.SphereGeometry(.3, 28.8, 14.4);
  moonNormal  = textureLoader.load('assets/otherMoonPics/lastMoonPics/normal.jpg');
  moonMap = textureLoader.load('assets/otherMoonPics/lastMoonPics/moonPic.jpg');
  var ballTexture = new THREE.MeshPhongMaterial( { map: moonMap, normalMap: moonNormal} );
  ball = new Physijs.SphereMesh(ballGeometry, ballTexture, undefined, { restitution: Math.random() * 1.5 } );
  ball.castShadow = true;
  ball.position.z = -2;
  ball.position.x = 2;
  ball.position.y = 4;
  ball.__dirtyPosition = true;
  ball.receiveShadow = true;
  scene.add( ball );


  var manager = new THREE.LoadingManager();
  manager.onProgress = function ( item, loaded, total ) {
    console.log( item, loaded, total );
  };
  var onError = function(xhr) {
  };

  var imageMap = new THREE.Texture();
  var normalMap = new THREE.Texture();
  var specMap = new THREE.Texture();

  var loader = new THREE.ImageLoader(manager);
  loader.load('assets/astronaut/Astronaut_D.jpg', function(img) {
    imageMap.image = img;
    imageMap.needsUpdate = true;
  });

  var loader = new THREE.ImageLoader(manager);
  loader.load('assets/astronaut/Astronaut_N.jpg', function(img) {
    normalMap.image = img;
    normalMap.needsUpdate = true;
  });

  var loader = new THREE.ImageLoader(manager);
  loader.load('assets/astronaut/Astronaut_S.jpg', function(img) {
    specMap.image = img;
    specMap.needsUpdate = true;
  });
  var loader = new THREE.OBJLoader( manager );
  loader.load( 'assets/astronaut/Astronaut.OBJ', function ( object ) {
    object.traverse( function ( child ) {
       if ( child instanceof THREE.Mesh ) {
          // child.material.normalMap = decalNormal;
          child.material.map = imageMap;
          child.material.normalMap = normalMap;
          child.material.specualarMap = specMap;
          child.castShadow = true;
        }
      });

    object.position.y = -.22;
    object.position.x = 2;
    object.position.z = -3;
    object.scale.set(.5,.5,.5);
    astronaut = object;
    scene.add( object );
  });

  // var axis = new THREE.AxisHelper(100);
  // scene.add(axis);

  //Material for ground, adding physJS props
  floorRocks = textureLoader.load('assets/finalMoonPics/rocks.jpg');
  //floorBump = textureLoader.load( 'assets/moonPics/cropBump.jpg' );
  floorMaterial = Physijs.createMaterial(
    new THREE.MeshPhongMaterial({ map: floorRocks, side: THREE.DoubleSide }),
    .8, // high friction
    .4 // low restitution
  );
  floorMaterial.map.wrapS = floorMaterial.map.wrapT = THREE.RepeatWrapping;
  floorMaterial.map.repeat.set( 2 , 2 );

  // Ground
  ground = new Physijs.BoxMesh(
    new THREE.CubeGeometry(10, 1, 10),
    floorMaterial,
    0 // mass
  );
  ground.receiveShadow = true;
  ground.position.y = -.7;

  scene.add( ground );

  var floorMat = new THREE.MeshPhongMaterial({ map: floorRocks,  side: THREE.DoubleSide });
  // floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
  // floorTexture.repeat.set( 2 , 2 );
  // floorNormal.wrapS = floorNormal.wrapT = THREE.RepeatWrapping;
  // floorNormal.repeat.set( 2 , 2 );
  // var floorMaterial = new THREE.MeshPhongMaterial({ map: floorTexture, normalMap: floorNormal,  side: THREE.DoubleSide });
  var floorGeometry = new THREE.PlaneGeometry(12, 12, 3, 3);
  var floor = new THREE.Mesh(floorGeometry, floorMat);
  floor.position.y = -.5;
  floor.receiveShadow = true;
  floor.rotation.x = Math.PI / 1.9;
  //scene.add(floor)




  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.addEventListener('change', render);


  camera.lookAt(scene);




  function displaygui(){
  var gui = new dat.GUI();
  var placement = 2.5;
  var speed = 0.005;
  var jar;

  parameters = {
    a: true,
    x: -90, y: 20, z: 4,
    bX: 0, bY: 20, bZ: -50,
    rotateX: .000, rotateY: .002, rotateZ: .000,
    cRotateX: .000, cRotateY: .001,
    xLight: 85, yLight: 60, zLight: 60,
    intensity: 0
  };

  var posit = gui.addFolder('Earth Position');
  var xspot = posit.add(parameters, 'x').min(-80).max(10).step(placement).name('X Position');
  var yspot = posit.add(parameters, 'y').min(-30).max(60).step(placement).name('Y Position');
  var zspot = posit.add(parameters, 'z').min(-420).max(-100).step(placement).name('Z Position');
  xspot.onChange(function(jar){moon.position.x = jar;});
  yspot.onChange(function(jar){moon.position.y = jar;});
  zspot.onChange(function(jar){moon.position.z = jar;});


  var bPosit = gui.addFolder('Ball Position');
  var bXSpot = bPosit.add(parameters, 'bX').min(-6).max(6.5).step(speed).name('X Position');
  var bYSpot = bPosit.add(parameters, 'bY').min(0).max(4.5).step(speed).name('Y Position');
  var bZSpot = bPosit.add(parameters, 'bZ').min(-220).max(1).step(speed).name('Z Position');
  bXSpot.onChange(function(jar){ball.position.x = jar;});
  bYSpot.onChange(function(jar){ball.position.y = jar;});
  bZSpot.onChange(function(jar){ball.position.z = jar;});


  var rotate = gui.addFolder('Earth Rotation');
  var xspin = rotate.add(parameters, 'rotateX').min(0).max(.09).step(speed).name('Rotate Earth X ');
  var yspin = rotate.add(parameters, 'rotateY').min(0).max(.09).step(speed).name('Rotate Earth Y ');
  var zspin = rotate.add(parameters, 'rotateZ').min(0).max(.09).step(speed).name('Rotate Earth Z ');


  var cloudRotate = gui.addFolder('Cloud Rotation');
  var cxspin = cloudRotate.add(parameters, 'cRotateX').min(0).max(.09).step(speed).name('Rotate Clouds X ');
  var cyspin = cloudRotate.add(parameters, 'cRotateY').min(0).max(.09).step(speed).name('Rotate Clouds Y ');


  var show = gui.addFolder('Display');
  var model = show.add(parameters, 'a').name("Allow Existence");
  model.onChange(function(jar){moon.visible = jar;});


  var light = gui.addFolder('Light');
  var xlight = light.add(parameters, 'x').min(-220).max(560).step(placement).name('X Position');
  var ylight = light.add(parameters, 'y').min(-220).max(560).step(placement).name('Y Position');
  var zlight = light.add(parameters, 'z').min(15).max(250).step(placement).name('Z Position');
  var intense = light.add(parameters, 'intensity').min(0.5).max(4).step(speed).name('Intensity');
  xlight.onChange(function(jar){spotLight.position.x = jar;});
  ylight.onChange(function(jar){spotLight.position.y = jar;});
  zlight.onChange(function(jar){spotLight.position.z = jar;});
  intense.onChange(function(jar){spotLight.intensity = jar;});

  gui.close();
  }

  var spotLight =  new THREE.SpotLight( 0xF0F0F0 );
  spotLight.intesity = parameters.intensity;
  spotLight.castShadow = true;
  spotLight.position.set(230, 218, 15);

  scene.add( spotLight );

  var spotLight2 =  new THREE.SpotLight( 0xBDBDBD );
  spotLight2.position.set(8, 2, 1);
  spotLight2.castShadow = true;
  spotLight2.distance = 40;
  spotLight2.fov = 15;
  spotLight2.target.position.set( -.22, 2, -3.8 );

  scene.add( spotLight2 );

  // var light = new THREE.DirectionalLight( 0xBDBDBD );
// light.position.set( 0, 1, 1 ).normalize();
// scene.add(light);

// var ambientLight = new THREE.AmbientLight(0xD3D3D3);
// scene.add(ambientLight);


// var helper = new THREE.SpotLightHelper( spotLight2 );
// scene.add(helper);


  render();
  function render() {
    scene.simulate(); // run physics



    earth.rotation.x += parameters.rotateX;
    earth.rotation.y -= parameters.rotateY;
    earth.rotation.z += parameters.rotateZ;

    cloudMesh.rotation.x -= parameters.cRotateX;
    cloudMesh.rotation.y -= parameters.cRotateY;



    // setTimeout(function(){ astronaut.rotation.y += .002; }, 1000);

    if (keyboard[65]){
      ball.setLinearVelocity(new THREE.Vector3(0, 10, 1));
    }

     if (keyboard[87]){
      //ball.setAngularVelocity(new THREE.Vector3(5, 5, 0));
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

    if (finalTime < .4){
      console.log('fT', finalTime); 
       ball.setLinearVelocity(new THREE.Vector3(0, 22, 1));
       finalTime = undefined; 
    }
    if (finalTime > .4){
      console.log('fT', finalTime); 
       ball.setLinearVelocity(new THREE.Vector3(0, 8, 1));
      finalTime = undefined; 
    }
    //  if (time2 !== undefined && time2 < 1){
    //    ball.setLinearVelocity(new THREE.Vector3(0, 15, 1));
    //    time2 = 1; 
    // }
    // if (time2 !== undefined && time2 > 1){
    //    ball.setLinearVelocity(new THREE.Vector3(0, 4, 1));
    //    time = 1; 
    // }
    // var dtime   = Date.now() - startTime;
    // mesh.scale.x    = .5 + 0.3*Math.sin(dtime/1000);
    // mesh.scale.y    = .5 + 0.3*Math.sin(dtime/1000);
    // mesh.scale.z    = .5 + 0.3*Math.sin(dtime/1000);

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
  renderer.render( scene, camera );
  
});


  //    function onWindowResize() {
  //        camera.aspect = window.innerWidth / window.innerHeight;
  //        camera.updateProjectionMatrix();
  //        renderer.setSize( window.innerWidth, window.innerHeight );
  //        render();

  // }
