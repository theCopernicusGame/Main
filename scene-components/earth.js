'use strict';

var earthGeometry = new THREE.SphereGeometry(36, 28.8, 14.4);
var textureLoader = new THREE.TextureLoader();
var earthMap  = textureLoader.load('assets/earthPics/earthmap1k.jpg');
var earthBump = textureLoader.load('assets/earthPics/earthbump1k.jpg');
var earthSpec = textureLoader.load('assets/earthPics/earthspec1k.jpg');
var earthTexture = new THREE.MeshPhongMaterial( { map: earthMap, bumpMap: earthBump, specularMap: earthSpec} );
var earth = new THREE.Mesh(earthGeometry, earthTexture );
earth.position.z = 80;
earth.position.x = -300;
earth.position.y = -10;
earth.castShadow = true;


var cloudGeometry   = new THREE.SphereGeometry(37, 28.8, 14.4);
var canvasCloud = textureLoader.load('assets/earthPics/earth_clouds.png');
var cloudMaterial  = new THREE.MeshPhongMaterial( {map: canvasCloud, transparent: true, depthWrite: false, opacity: .7} );
var cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
earth.add(cloudMesh);
