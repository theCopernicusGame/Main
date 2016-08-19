'use strict';

var textureLoader = new THREE.TextureLoader();
var ground_material = Physijs.createMaterial(
  new THREE.MeshPhongMaterial({
    map: textureLoader.load( 'assets/finalMoonpics/normal.jpg' )
    // normalMap: textureLoader.load( 'assets/finalMoonpics/moonPic.jpg' )
  }), .8, .3);
ground_material.map.wrapS = ground_material.map.wrapT = THREE.RepeatWrapping;
ground_material.map.repeat.set( 2.5, 2.5 );

// Ground
var NoiseGen = new SimplexNoise;

var ground_geometry = new THREE.PlaneGeometry( 75, 75, 50, 50 );
for ( var i = 0; i < ground_geometry.vertices.length; i++ ) {
  var vertex = ground_geometry.vertices[i];
  vertex.z = NoiseGen.noise( vertex.x / 100, vertex.y / 130 ) * 1.01;
}
ground_geometry.computeFaceNormals();
ground_geometry.computeVertexNormals();

var ground = new Physijs.HeightfieldMesh(
  ground_geometry,
  ground_material,
  0, // mass
  50,
  50
);
ground.rotation.x = Math.PI / -2;
ground.receiveShadow = true