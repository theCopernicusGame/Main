saturnOrbitRadius = 405,
saturnOrbitAngle = -165,
saturnOrbitSpeed = 0.1;

var saturnGeometry = new THREE.SphereGeometry(15, 28.8, 14); 
var saturnMap  = textureLoader.load('assets/planetPics/saturnmap.jpg');
var saturnTexture =  new THREE.MeshPhongMaterial( { map: saturnMap} );
Saturn = new THREE.Mesh( saturnGeometry, saturnTexture); 
Saturn.receiveShadow = true; 
Saturn.rotation.x = Math.PI / .5;


var ringMap  = textureLoader.load('assets/planetPics/saturnringcolor.jpg');
var ringAlphaMap = textureLoader.load('assets/planetPics/saturnringpattern.gif');
var Ring = new THREE.Mesh(new THREE.RingGeometry(24.5, 28, 50), new THREE.MeshPhongMaterial({map: ringMap, side: THREE.DoubleSide, alphaMap: ringAlphaMap}));
Ring.rotation.x = Math.PI / 1.85;

var iRing = new THREE.Mesh(new THREE.RingGeometry(19, 24, 50), new THREE.MeshPhongMaterial({map: ringMap, side: THREE.DoubleSide, alphaMap: ringAlphaMap}));
iRing.rotation.x = Math.PI / 1.85;
