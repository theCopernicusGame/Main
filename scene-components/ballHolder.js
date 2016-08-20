  var ballHolder = new Physijs.BoxMesh(
    new THREE.CubeGeometry( 2, 1.35, 2 ),
    new THREE.MeshBasicMaterial({ color: 0xFF0000 }),
    1,
    50,
    50
  );
  ballHolder.position.set( 6, 0.5, 0 );
  ballHolder.visible = false;


//var bumper1 = new Physijs.BoxMesh( bumper_geom, bumperMaterial, 0, { restitution: .2 } );



  //ballHolder.visible = false;

   // target2.position.set(3, .5, 0);