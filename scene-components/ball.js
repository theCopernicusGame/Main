'use strict';

var textureLoader = new THREE.TextureLoader();
var ballGeometry = new THREE.SphereGeometry(.3, 28.8, 14.4);
var moonNormal  = textureLoader.load('assets/finalMoonPics/normal.jpg');
var moonMap = textureLoader.load('assets/finalMoonPics/moonPic.jpg');
var ballTexture = new THREE.MeshPhongMaterial( { map: moonMap, normalMap: moonNormal} );//TEST RED BALL FOR LOAD TIME
var ballTexture2 = new THREE.MeshPhongMaterial( { color: 0xFF0000} );
var ball = new Physijs.SphereMesh(ballGeometry, ballTexture, 1, .9  );
ball.castShadow = true;
ball.position.z = -2;
ball.position.x = 2;
ball.position.y = 4;
ball.__dirtyPosition = true;
ball.receiveShadow = true;
