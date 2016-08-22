'use strict';

var ballHolder = new Physijs.BoxMesh(
  new THREE.CubeGeometry( 2, 0.1, 2 ),
  new THREE.MeshBasicMaterial({ color: 0x888888 }),
  0,
  50,
  50
);

ballHolder.position.set( 6, 1, 0 );
ballHolder.visible = false;
