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

var spotLight =  new THREE.SpotLight( 0xF0F0F0 );
spotLight.intesity = parameters.intensity;
spotLight.castShadow = true;
spotLight.position.set(230, 218, 15);

var spotLight2 =  new THREE.SpotLight( 0xBDBDBD );
spotLight2.position.set(8, 2, 1);
spotLight2.castShadow = true;
spotLight2.distance = 40;
spotLight2.fov = 15;
spotLight2.target.position.set( -.22, 2, -3.8 );
