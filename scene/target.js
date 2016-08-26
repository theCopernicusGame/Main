'use strict';

var textureLoader = new THREE.TextureLoader();

// cap geometry
var targetGeometry = new THREE.CylinderGeometry( 1, 1, .0001, 32 );

// cylinder material
var targetMaterial = new THREE.MeshBasicMaterial({ color: 0xFF0000, side: THREE.DoubleSide });

// cylinder
var target = new Physijs.Mesh(targetGeometry, targetMaterial, 0);
target.position.set(-8, 0, 0);

// cap geometries
var capGeometry1 = new THREE.CircleGeometry( 1, 32 );
var capGeometry2 = new THREE.CircleGeometry( .8, 32 );
var capGeometry3 = new THREE.CircleGeometry( .6, 32 );
var capGeometry4 = new THREE.CircleGeometry( .4, 32 );
var capGeometry5 = new THREE.CircleGeometry( .2, 32 );
var capGeometry6 = new THREE.CircleGeometry( .1, 32 );

// end-cap materials
var whiteCapMaterial = new THREE.MeshBasicMaterial({
  color: 0xFFFFFF,
  side: THREE.DoubleSide
});

var redCapMaterial = new THREE.MeshBasicMaterial({
  color: 0xFF0000,
  side: THREE.DoubleSide
});

function setPosition(cap, height) {
  cap.rotation.x = Math.PI/2;
  cap.position.set(-8, height, 0);
}

// caps
var cap1 = new THREE.Mesh(capGeometry1, whiteCapMaterial);
setPosition(cap1, .0002);

var cap2 = new THREE.Mesh(capGeometry2, redCapMaterial);
setPosition(cap2, .0003);

var cap3 = new THREE.Mesh(capGeometry3, whiteCapMaterial);
setPosition(cap3, .0004);

var cap4 = new THREE.Mesh(capGeometry4, redCapMaterial);
setPosition(cap4, .0005);

var cap5 = new THREE.Mesh(capGeometry5, whiteCapMaterial);
setPosition(cap5, .0006);

var cap6 = new THREE.Mesh(capGeometry6, redCapMaterial);
setPosition(cap6, .0007);
