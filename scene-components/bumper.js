'use strict';

var bumper_geom = new THREE.CubeGeometry(.5, .3, 1.5);
var bumperMaterial = new THREE.MeshLambertMaterial( { color: 0xFF0000 } );

// OOP?
var bumper1 = new Physijs.BoxMesh( bumper_geom, bumperMaterial, 0, { restitution: .2 } );
bumper1.position.z = 2.5;
bumper1.position.y = -.1;
bumper1.position.x = .5;
bumper1.receiveShadow = true;
bumper1.castShadow = true;

var bumper2 = new Physijs.BoxMesh( bumper_geom, bumperMaterial, 0, { restitution: .2 } );
bumper2.position.z = 2.5;
bumper2.position.y = -.1;
bumper2.position.x = 2.5;
bumper2.receiveShadow = true;
bumper2.castShadow = true;

var bumper3 = new Physijs.BoxMesh( bumper_geom, bumperMaterial, 0, { restitution: .2 } );
bumper3.position.z = 3;
bumper3.position.y = -.1;
bumper3.position.x = 1.5;
bumper3.rotation.y = Math.PI / 2;
bumper3.receiveShadow = true;
bumper3.castShadow = true;
