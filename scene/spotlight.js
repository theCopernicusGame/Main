'use strict';

var parameters = {
  a: true,
  x: -90, y: 20, z: 4,
  bX: 0, bY: 20, bZ: -50,
  rotateX: .000, rotateY: .0013, rotateZ: .000,
  cRotateX: .000, cRotateY: .001,
  xLight: 85, yLight: 60, zLight: 60,
  intensity: 0
};

var spotlight =  new THREE.SpotLight( 0xF0F0F0 );
spotlight.intesity = parameters.intensity;
spotlight.castShadow = true;
spotlight.position.set(230, 75, 15);

var spotlight2 =  new THREE.SpotLight( 0xBDBDBD );
spotlight2.position.set(8, 2, 1);
spotlight2.castShadow = true;
spotlight2.distance = 40;
spotlight2.fov = 15;
spotlight2.target.position.set( -.22, 2, -3.8 );
