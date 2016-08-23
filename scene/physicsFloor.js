'use strict';

var fakeFloor = new Physijs.BoxMesh(
    new THREE.CubeGeometry( 30, 1, 10 ),
    new THREE.MeshBasicMaterial({ color: 0x888888 }),
    0,
    50,
    50
  );

fakeFloor.position.set( 0, -0.5, 0 );
fakeFloor.visible = false;
